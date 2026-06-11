import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log to console (or send to monitoring)
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, info);
  }

  resetErrorBoundary = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl w-full text-center">
            <div className="text-red-500 text-5xl mb-4">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Unexpected Error</h2>
            <p className="text-gray-600 mt-2">{String(error?.message || error)}</p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={this.resetErrorBoundary}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-200 text-gray-900 font-semibold rounded-full hover:bg-gray-300 transition"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;


