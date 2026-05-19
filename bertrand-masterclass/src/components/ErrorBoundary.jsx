import React from 'react';

// ═══════════════════════════════════════════════════════════
// ERROR BOUNDARY — Prevents a single component crash from
// taking down the entire application. Displays a calm,
// on-brand recovery screen that matches the Slow Web aesthetic.
// ═══════════════════════════════════════════════════════════

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Voix Vive] Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif",
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '16px',
            opacity: 0.6,
          }}>
            🎸
          </div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.6rem',
            fontWeight: 400,
            color: '#f0e6d2',
            margin: '0 0 12px',
          }}>
            A string broke
          </h2>
          <p style={{
            color: '#6a7a8a',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            maxWidth: '340px',
            margin: '0 0 24px',
            fontFamily: "'EB Garamond', serif",
            fontStyle: 'italic',
          }}>
            Something unexpected happened. Take a breath — this is just a technical hiccup, not a wrong note.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              background: 'rgba(201,169,110,0.15)',
              border: '1px solid rgba(201,169,110,0.3)',
              color: '#c9a96e',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.8rem',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            Return Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
