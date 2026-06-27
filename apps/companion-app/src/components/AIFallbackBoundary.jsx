import React from 'react';
import { AlertCircle } from 'lucide-react';

export class AIFallbackBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("AIFallbackBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-red-900/20 rounded-2xl border border-red-500/50 m-4">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2 font-mono uppercase tracking-widest text-center">
            AI Engine Offline
          </h2>
          <p className="text-sm text-red-200 text-center mb-4 max-w-sm">
            The AI companion encountered a critical error. This can happen if your device runs out of memory or if WebGPU crashes.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-mono uppercase tracking-widest text-sm rounded-lg transition-colors shadow-lg"
          >
            Restart Engine
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
