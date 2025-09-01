interface ErrorBannerProps {
  error: string | null;
  onDismiss?: () => void;
}

export default function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  if (!error) return null;

  const isUnauthorized = error.includes('401') || error.toLowerCase().includes('unauthorized');

  return (
    <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          {isUnauthorized && (
            <p className="text-red-600 text-xs mt-2">
              💡 Tip: Check if the API key is properly set in server environment variables
            </p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 ml-2"
            aria-label="Dismiss error"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
