import React from 'react';

export default function ErrorBoundary({ children }) {
  const [error, setError] = React.useState(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    setError(null);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Unexpected Error</h2>
          <p className="text-gray-600 mt-2">{String(error?.message || error)}</p>
          <button
            onClick={() => {
              // Soft reset
              window.location.reload();
            }}
            className="mt-5 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <React.ErrorBoundary
      fallbackRender={({ error: boundaryError, resetErrorBoundary }) => (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl w-full text-center">
            <div className="text-red-500 text-5xl mb-4">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Unexpected Error</h2>
            <p className="text-gray-600 mt-2">{String(boundaryError?.message || boundaryError)}</p>
            <button
              onClick={() => resetErrorBoundary()}
              className="mt-5 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
            >
              Try again
            </button>
          </div>
        </div>
      )}
      onError={(e) => setError(e)}
    >
      {children}
    </React.ErrorBoundary>
  );
}

