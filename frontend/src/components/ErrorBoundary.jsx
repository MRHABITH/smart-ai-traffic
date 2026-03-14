import React from 'react';
import { motion } from 'framer-motion';

/**
 * Error Boundary Component
 * Catches component errors and displays fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6"
        >
          <div className="max-w-md bg-red-900/40 border-2 border-red-600 rounded-2xl p-8 text-center shadow-lg">
            <p className="text-5xl mb-4">⚠️</p>
            <h2 className="text-2xl font-bold text-red-300 mb-3">Something went wrong</h2>
            <p className="text-red-200 mb-6 text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="text-left bg-slate-800/50 p-3 rounded mb-6 border border-slate-600 text-xs text-slate-300 overflow-auto max-h-32">
                <summary className="cursor-pointer font-bold mb-2">Error Details</summary>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
