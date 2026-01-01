import React from 'react';

type Props = { children: React.ReactNode; fallback?: React.ReactNode };

type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    try {
      // Log a concise component stack in production too
      console.error('ErrorBoundary caught:', error);
      if (info?.componentStack) {
        console.error('Component stack:', String(info.componentStack));
      }
    } catch {
      console.error('ErrorBoundary caught (logging failed)');
    }
  }
  render() {
    if (this.state.hasError) {
      const msg = this.state.error && (this.state.error.message || String(this.state.error));
      // If a custom fallback is provided, render it and append the error message for context.
      if (this.props.fallback) {
        return (
          <div style={{ padding: 16 }}>
            {this.props.fallback}
            {msg && (
              <div style={{ marginTop: 6, color: '#b91c1c', fontSize: 12 }}>
                {String(msg)}
              </div>
            )}
          </div>
        );
      }
      return (
        <div style={{ padding: 24, color: '#b91c1c' }}>
          Something went wrong{msg ? `: ${msg}` : '.'}
        </div>
      );
    }
    return this.props.children as any;
  }
}
