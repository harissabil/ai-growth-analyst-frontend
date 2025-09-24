'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { exchangeCodeForToken, setToken, setUserId } from '@/lib/auth';
import Image from 'next/image';

export default function MicrosoftCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams?.get('code');
        const state = searchParams?.get('state');
        const error = searchParams?.get('error');

        if (error) {
          throw new Error('Authentication was cancelled or failed');
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Verify state (CSRF protection)
        const storedState = sessionStorage.getItem('oauth_state');
        if (state !== storedState) {
          throw new Error('Invalid state parameter');
        }

        // Exchange code for token
        const authResponse = await exchangeCodeForToken(code);

        // Store authentication data
        setToken(authResponse.data.token);
        setUserId(authResponse.data.user_id);

        setStatus('success');

        // Redirect to main app after short delay
        setTimeout(() => {
          router.push('/chat');
        }, 1000);

      } catch (err: any) {
        console.error('Authentication error:', err);
        setError(err.message || 'Authentication failed');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  const handleRetry = () => {
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <Image
          src="/logo_swo.png"
          alt="SoftwareOne"
          width={80}
          height={80}
          className="mx-auto object-contain"
        />

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-900">
              Completing sign-in...
            </h2>
            <p className="text-sm text-gray-600">
              Please wait while we verify your credentials
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Sign-in successful!
            </h2>
            <p className="text-sm text-gray-600">
              Redirecting you to the application...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-8 h-8 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Sign-in failed
            </h2>
            <p className="text-sm text-red-600">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Try signing in again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
