'use client';

import { useState, useEffect } from 'react';
import { getMicrosoftAuthUrl, isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AuthPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated()) {
      router.push('/chat');
    }
  }, [router]);

  const handleSignIn = () => {
    try {
      const authUrl = getMicrosoftAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to initialize sign-in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Image
            src="/logo_swo.png"
            alt="SoftwareOne"
            width={80}
            height={80}
            className="mx-auto object-contain"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            AI Growth Analyst
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your AI-powered business insights
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleSignIn}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 0H0V11H11V0Z"
                fill="#F25022"
              />
              <path
                d="M23 0H12V11H23V0Z"
                fill="#7FBA00"
              />
              <path
                d="M11 12H0V23H11V12Z"
                fill="#00A4EF"
              />
              <path
                d="M23 12H12V23H23V12Z"
                fill="#FFB900"
              />
            </svg>
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  );
}
