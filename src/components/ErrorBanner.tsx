interface ErrorBannerProps {
  error: string | null;
  onDismiss?: () => void;
}

export default function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  if (!error) return null;

  const isUnauthorized = error.includes('401') || error.toLowerCase().includes('unauthorized');

  return (
     <div className="mx-4 mt-4 animate-in slide-in-from-top duration-300">
      <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl shadow-md backdrop-blur-sm">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-red-800 font-semibold text-sm">Something went wrong</p>
              <p className="text-red-700 text-sm mt-1 leading-relaxed">{error}</p>
              {isUnauthorized && (
                <div className="mt-3 p-3 bg-red-100/50 rounded-lg border border-red-200">
                  <p className="text-red-600 text-xs flex items-center space-x-2">
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
              className="text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full p-1 transition-all duration-200"
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
