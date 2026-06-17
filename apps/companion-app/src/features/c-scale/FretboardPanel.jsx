import { lazy, Suspense } from 'react';
import FretboardExplorer from '../../features/vr-fretboard/FretboardExplorer';

const CScaleVisualizer = lazy(() => import('../../components/xr/CScaleVisualizer'));

export default function FretboardPanel({ threeDMode, activeStage }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 relative min-h-[400px]">
      {threeDMode ? (
        <Suspense fallback={<div className="text-white/40 font-mono text-[0.8rem]">Loading 3D Preview…</div>}>
          <CScaleVisualizer activeStage={activeStage} />
        </Suspense>
      ) : (
        <FretboardExplorer maxFret={12} presetRoot={0} presetScale={'major'} />
      )}
    </div>
  );
}

