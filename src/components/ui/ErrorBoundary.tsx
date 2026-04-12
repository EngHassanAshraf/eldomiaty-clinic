'use client';
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="card-base glass p-6 text-center space-y-3">
          <p className="text-[#e8294a] font-semibold">حدث خطأ غير متوقع</p>
          <p className="text-sm text-[#8a6a6a]">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-outline-rose text-sm px-4 py-2"
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
