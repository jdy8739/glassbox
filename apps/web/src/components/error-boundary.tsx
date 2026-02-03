'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6">
          <div className="glass-panel p-8 max-w-md w-full text-center space-y-6 border-red-500/20 bg-red-500/5">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-black/60 dark:text-white/60 mb-4">
                We encountered an unexpected error while rendering this component.
              </p>
              {this.state.error && (
                <div className="bg-black/5 dark:bg-white/5 p-3 rounded-lg text-xs font-mono text-left overflow-auto max-h-32 mb-6">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-lg shadow-red-500/20"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
