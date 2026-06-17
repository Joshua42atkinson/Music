import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { ScaffoldingProvider, useScaffolding } from '../ScaffoldingProvider';

// Mock all dependencies
vi.mock('../../data/tractionStore');
vi.mock('../../lib/progressSyncEngine');
vi.mock('../../hooks/useAuth');
vi.mock('../../hooks/useScaffoldingActions');
vi.mock('../../data/dag/dagNodes');
vi.mock('../../data/dag/dagEdges');
vi.mock('../../data/curriculumIndexer');
vi.mock('../../lib/devLog');

import {
  loadTraction,
  getScaffoldingLevel,
  getCurrentPhase,
} from '../../data/tractionStore';
import {
  hydrateFromIndexedDB,
  syncWithCloud,
  persistTraction,
  subscribeToStorageSync,
} from '../../lib/progressSyncEngine';
import { useAuth } from '../../hooks/useAuth';
import { useScaffoldingActions } from '../../hooks/useScaffoldingActions';
import { getNodeById } from '../../data/dag/dagNodes';
import { getNextRecommendedNode } from '../../data/dag/dagEdges';
import { indexCurriculum } from '../../data/curriculumIndexer';

const wrapper = ({ children }) => <ScaffoldingProvider>{children}</ScaffoldingProvider>;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(loadTraction).mockReturnValue({
    _schemaVersion: 2,
    _persistedAt: 0,
    totalTraction: 10,
    settings: {},
    currentNodeId: 'fret-1-class-be',
    completedNodes: [],
  });
  vi.mocked(getScaffoldingLevel).mockReturnValue(1.0);
  vi.mocked(getCurrentPhase).mockReturnValue('be');
  vi.mocked(hydrateFromIndexedDB).mockResolvedValue(null);
  vi.mocked(syncWithCloud).mockResolvedValue(null);
  vi.mocked(persistTraction).mockResolvedValue(undefined);
  vi.mocked(subscribeToStorageSync).mockReturnValue(() => {});
  vi.mocked(useAuth).mockReturnValue({ user: null });
  vi.mocked(useScaffoldingActions).mockReturnValue({
    toggleGlobalMode: vi.fn(),
    toggleAI: vi.fn(),
    toggleGame: vi.fn(),
    completePhase: vi.fn(),
    advanceNode: vi.fn(),
    navigateToNode: vi.fn(),
    markDepth: vi.fn(),
    passGate: vi.fn(),
  });
  vi.mocked(getNodeById).mockReturnValue({ id: 'fret-1-class-be', fret: 1, pillar: 'class' });
  vi.mocked(getNextRecommendedNode).mockReturnValue('fret-1-class-be');
  vi.mocked(indexCurriculum).mockResolvedValue(undefined);
});

describe('ScaffoldingProvider', () => {
  it('hydrates from IndexedDB on mount', async () => {
    const restored = { _schemaVersion: 2, totalTraction: 50, settings: {}, currentNodeId: 'fret-1-class-be', completedNodes: [] };
    vi.mocked(hydrateFromIndexedDB).mockResolvedValue(restored);

    const { result } = renderHook(() => useScaffolding(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.traction.totalTraction).toBe(50);
    expect(hydrateFromIndexedDB).toHaveBeenCalled();
  });

  it('falls back to loadTraction when IndexedDB is empty', async () => {
    vi.mocked(hydrateFromIndexedDB).mockResolvedValue(null);

    const { result } = renderHook(() => useScaffolding(), { wrapper });

    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(result.current.traction.totalTraction).toBe(10);
  });

  it('updateTraction persists state', async () => {
    const { result } = renderHook(() => useScaffolding(), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    result.current.updateTraction({ totalTraction: 25 });

    await waitFor(() => expect(result.current.traction.totalTraction).toBe(25));
    expect(persistTraction).toHaveBeenCalledWith(
      expect.objectContaining({ totalTraction: 25 }),
      null
    );
  });

  it('syncs with cloud when user logs in', async () => {
    const merged = { _schemaVersion: 2, totalTraction: 99, settings: {}, currentNodeId: 'fret-1-class-be', completedNodes: [] };
    vi.mocked(syncWithCloud).mockResolvedValue(merged);

    // Start with no user
    vi.mocked(useAuth).mockReturnValue({ user: null });
    const { result, rerender } = renderHook(() => useScaffolding(), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));

    // Simulate login
    vi.mocked(useAuth).mockReturnValue({ user: { id: 'user-123' } });
    rerender();

    await waitFor(() => expect(result.current.traction.totalTraction).toBe(99));
    expect(syncWithCloud).toHaveBeenCalledWith('user-123');
  });

  it('useScaffolding returns fallback outside provider', () => {
    const { result } = renderHook(() => useScaffolding());
    expect(result.current.isFallback).toBe(true);
    expect(result.current.scaffolding).toBe(1.0);
  });

  it('subscribes to cross-tab storage sync', async () => {
    const { result } = renderHook(() => useScaffolding(), { wrapper });
    await waitFor(() => expect(result.current.isHydrated).toBe(true));
    expect(subscribeToStorageSync).toHaveBeenCalled();
  });
});
