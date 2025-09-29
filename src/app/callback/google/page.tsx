'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { exchangeGoogleCodeForToken } from '@/lib/auth';

function GoogleCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const code = searchParams.get('code');
                const state = searchParams.get('state');
                const error = searchParams.get('error');

                if (error) {
                    throw new Error(`OAuth error: ${error}`);
                }

                if (!code) {
                    throw new Error('No authorization code received');
                }

                // Verify state to prevent CSRF attacks
                const storedState = sessionStorage.getItem('google_oauth_state');
                if (!storedState || storedState !== state) {
                    throw new Error('Invalid state parameter');
                }

                // Exchange code for token
                await exchangeGoogleCodeForToken(code);

                // Clean up stored state
                sessionStorage.removeItem('google_oauth_state');

                // Redirect to settings page with success message
                router.push('/chat?settings=true&google_connected=true');
            } catch (err) {
                console.error('Google OAuth callback error:', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setIsProcessing(false);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Google Sign-in Failed
                        </h2>
                        <p className="text-sm text-red-600 break-words mb-4">
                            {error}
                        </p>
                        <button
                            onClick={() => router.push('/chat')}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Return to Chat
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
                    <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Connecting to Google
                    </h2>
                    <p className="text-sm text-gray-600">
                        Please wait while we complete your Google authentication...
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Loading...
                        </h2>
                        <p className="text-sm text-gray-600">
                            Preparing Google authentication...
                        </p>
                    </div>
                </div>
            </div>
        }>
            <GoogleCallbackContent />
        </Suspense>
    );
}
