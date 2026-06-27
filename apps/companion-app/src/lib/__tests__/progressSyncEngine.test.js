import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all dependencies (hoisted by vitest)
vi.mock('../../data/tractionStore');
vi.mock('../../data/localDatabase');
vi.mock('../firebase');
vi.mock('../devLog');
vi.mock('../storage', () => ({
  vvGet: vi.fn((key) => {
    if (key === 'vv_cloud_sync') return 'true';
    return null;
  }),
  vvSet: vi.fn(),
  vvRemove: vi.fn(),
  vvGetJSON: vi.fn(),
  vvSetJSON: vi.fn(),
}));

// Import mocked modules and the module under test
import {
  loadTraction,
  saveTraction,
  mergeTractionStates,
  migrateTractionState,
  CURRENT_TRACTION_SCHEMA,
} from '../../data/tractionStore';
import { saveProgress, getProgress } from '../../data/localDatabase';
import { getTractionState, saveTractionState, migrateLocalToCloud } from '../firebase';
import { devLog, devWarn } from '../devLog';
import {
  hydrateFromIndexedDB,
  syncWithCloud,
  persistTraction,
  subscribeToStorageSync,
} from '../progressSyncEngine';

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(loadTraction).mockReturnValue({ _schemaVersion: 2, _persistedAt: 0, totalTraction: 10 });
  vi.mocked(mergeTractionStates).mockReturnValue({ _schemaVersion: 2, totalTraction: 99 });
  vi.mocked(migrateTractionState).mockImplementation((s) => s);
  vi.mocked(getProgress).mockResolvedValue(null);
  vi.mocked(saveProgress).mockResolvedValue(undefined);
  vi.mocked(getTractionState).mockResolvedValue(null);
  vi.mocked(saveTractionState).mockResolvedValue(undefined);
  vi.mocked(migrateLocalToCloud).mockResolvedValue(undefined);
  localStorage.clear();
  // Cloud sync is opt-in (Sovereign Default is local-only). Enable it so the
  // cloud-path assertions below actually exercise the Firebase sync branch.
  localStorage.setItem('vv_cloud_sync', 'true');
});

// ── Tests ──────────────────────────────────────────────────────
describe('hydrateFromIndexedDB', () => {
  it('returns null when both layers are empty', async () => {
    vi.mocked(loadTraction).mockReturnValue({ _schemaVersion: 0, _persistedAt: 0 });
    vi.mocked(getProgress).mockResolvedValue(null);

    const result = await hydrateFromIndexedDB();
    expect(result).toBeNull();
  });

  it('prefers IndexedDB when it is fresher', async () => {
    const idbState = { _schemaVersion: 2, _persistedAt: 2000, totalTraction: 50 };
    vi.mocked(loadTraction).mockReturnValue({ _schemaVersion: 2, _persistedAt: 1000, totalTraction: 10 });
    vi.mocked(getProgress).mockResolvedValue(idbState);

    const result = await hydrateFromIndexedDB();
    expect(result.totalTraction).toBe(50);
    expect(vi.mocked(saveTraction)).toHaveBeenCalled();
  });

  it('falls back to localStorage when IndexedDB is older', async () => {
    const idbState = { _schemaVersion: 2, _persistedAt: 500, totalTraction: 20 };
    const localState = { _schemaVersion: 2, _persistedAt: 1000, totalTraction: 10 };
    vi.mocked(loadTraction).mockReturnValue(localState);
    vi.mocked(getProgress).mockResolvedValue(idbState);

    const result = await hydrateFromIndexedDB();
    expect(result.totalTraction).toBe(10);
  });

  it('falls back to localStorage when IndexedDB read fails', async () => {
    const localState = { _schemaVersion: 2, _persistedAt: 1000, totalTraction: 10 };
    vi.mocked(loadTraction).mockReturnValue(localState);
    vi.mocked(getProgress).mockRejectedValue(new Error('IDB failure'));

    const result = await hydrateFromIndexedDB();
    expect(result.totalTraction).toBe(10);
  });
});

describe('syncWithCloud', () => {
  it.skip('merges local + cloud when cloud exists', async () => {
    const cloudState = { _schemaVersion: 2, _persistedAt: 3000, totalTraction: 80 };
    const localState = { _schemaVersion: 2, _persistedAt: 1000, totalTraction: 10 };
    vi.mocked(loadTraction).mockReturnValue(localState);
    vi.mocked(getTractionState).mockResolvedValue(cloudState);

    const result = await syncWithCloud('user-123');
    expect(vi.mocked(mergeTractionStates)).toHaveBeenCalled();
    expect(result.totalTraction).toBe(99);
    expect(vi.mocked(saveTraction)).toHaveBeenCalled();
    expect(vi.mocked(saveTractionState)).toHaveBeenCalledWith('user-123', expect.any(Object));
  });

  it('migrates local to cloud when no cloud data', async () => {
    const localState = { _schemaVersion: 2, _persistedAt: 1000, totalTraction: 10 };
    vi.mocked(loadTraction).mockReturnValue(localState);
    vi.mocked(getTractionState).mockResolvedValue(null);

    const result = await syncWithCloud('user-123');
    expect(vi.mocked(migrateLocalToCloud)).toHaveBeenCalledWith('user-123', localState);
    expect(result.totalTraction).toBe(10);
  });

  it('returns null on error', async () => {
    vi.mocked(getTractionState).mockRejectedValue(new Error('network error'));

    const result = await syncWithCloud('user-123');
    expect(result).toBeNull();
  });
});

describe('persistTraction', () => {
  it('writes to IndexedDB and localStorage', async () => {
    const state = { _schemaVersion: 2, totalTraction: 10 };

    await persistTraction(state);

    expect(vi.mocked(saveProgress)).toHaveBeenCalled();
    expect(vi.mocked(saveTraction)).toHaveBeenCalled();
    expect(vi.mocked(saveTractionState)).not.toHaveBeenCalled();
  });

  it('writes to Firebase when userId provided', async () => {
    const state = { _schemaVersion: 2, totalTraction: 10 };

    await persistTraction(state, 'user-123');

    expect(vi.mocked(saveProgress)).toHaveBeenCalled();
    expect(vi.mocked(saveTraction)).toHaveBeenCalled();
    expect(vi.mocked(saveTractionState)).toHaveBeenCalledWith('user-123', expect.any(Object));
  });

  it('still writes localStorage when IndexedDB fails', async () => {
    vi.mocked(saveProgress).mockRejectedValue(new Error('IDB full'));
    const state = { _schemaVersion: 2, totalTraction: 10 };

    await persistTraction(state);

    expect(vi.mocked(saveProgress)).toHaveBeenCalled();
    expect(vi.mocked(saveTraction)).toHaveBeenCalled();
  });
});

describe('subscribeToStorageSync', () => {
  it('returns an unsubscribe function', () => {
    const handler = vi.fn();
    const unsubscribe = subscribeToStorageSync(handler);
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });
});
