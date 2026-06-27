import React from 'react';
import { useLocale } from '../hooks/useLocale';
import { devError } from '../lib/devLog';

// ═══════════════════════════════════════════════════════════
// ERROR BOUNDARY — Prevents a single component crash from
// taking down the entire application. Displays a calm,
// on-brand recovery screen that matches the Slow Web aesthetic.
// ═══════════════════════════════════════════════════════════

// Wrapper to use hooks in class component
function ErrorContent({ onReset }) {
  const { t } = useLocale();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-10 px-6 text-center font-sans">
      <div className="text-[3rem] mb-4 opacity-60">🎸</div>
      <h2 className="font-heading text-[1.6rem] font-normal text-vv-text m-0 mb-3">
        {t('stringBroke')}
      </h2>
      <p className="text-[#6a7a8a] text-[0.9rem] leading-[1.6] max-w-[340px] m-0 mb-6 font-[EB_Garamond] italic">
        {t('errorHiccup')}
      </p>
      <button
        onClick={onReset}
        className="py-3 px-7 rounded-xl bg-cf-gold/[0.15] border border-cf-gold/30 text-cf-gold font-mono text-[0.8rem] tracking-[0.06em] cursor-pointer uppercase"
      >
        {t('returnHome')}
      </button>
    </div>
  );
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    devError('[Voix Vive] Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <ErrorContent onReset={() => {
            this.setState({ hasError: false, error: null });
            window.location.href = '/';
          }} />
          {/* DEBUG: Show actual error for bug reports — DEV only */}
          {import.meta.env.DEV && (
            <pre className="bg-[rgba(255,50,50,0.08)] border border-[rgba(255,80,80,0.3)] rounded-lg text-[#ff9999] text-[0.75rem] font-mono max-w-[90vw] w-[600px] max-h-[200px] overflow-auto p-3 mx-auto mb-6 text-left whitespace-pre-wrap break-words">
              {this.state.error?.toString?.() || 'Unknown error'}
            </pre>
          )}
        </>
      );
    }

    return this.props.children;
  }
}
