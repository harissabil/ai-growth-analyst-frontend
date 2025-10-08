interface ErrorBannerProps {
  error: string | null;
  onDismiss?: () => void;
}

export default function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  if (!error) return null;

  const isUnauthorized = error.includes('401') || error.toLowerCase().includes('unauthorized');

  return (
    <div className="mx-6 mt-4 animate-in slide-in-from-top duration-300">
      <div className="p-4 bg-gray-50 border-l-4 border-black rounded-r-xl swo-shadow-md">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-black font-semibold text-sm">Something went wrong</p>
              <p className="text-gray-700 text-sm mt-1 leading-relaxed">{error}</p>
              {isUnauthorized && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 swo-shadow">
                  <p className="text-gray-800 text-xs flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Check if the API key is properly set in server environment variables</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-600 hover:text-black hover:bg-gray-200 rounded-full p-1 transition-all duration-200"
              aria-label="Dismiss error"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
