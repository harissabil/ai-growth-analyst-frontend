'use client';

import { useState, useEffect } from 'react';
import { getUserId, clearAuth, getToken, getGoogleAuthUrl } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { GoogleOAuthToken, PlatformData, PlatformUpdateRequest } from '@/lib/types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditingState {
  isEditing: boolean;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [googleToken, setGoogleToken] = useState<GoogleOAuthToken | null>(null);
  const [platformData, setPlatformData] = useState<PlatformData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingState>({ isEditing: false });
  const [formData, setFormData] = useState<PlatformUpdateRequest>({});
  const [isGoogleAdsTokenSaving, setIsGoogleAdsTokenSaving] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auto-refresh data when component opens or when returning from OAuth
  useEffect(() => {
    if (isOpen) {
      setUserId(getUserId());
      refreshAllData();

      // Check if we're returning from Google OAuth
      const googleConnected = searchParams.get('google_connected');
      if (googleConnected === 'true') {
        // Clear the URL parameter and refresh after a short delay
        setTimeout(() => {
          window.history.replaceState({}, '', window.location.pathname);
          refreshAllData();
        }, 1000);
      }
    }
  }, [isOpen, searchParams]);

  // Periodic refresh to keep data up to date
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      refreshAllData(true); // Silent refresh
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  const refreshAllData = async (silent = false) => {
    if (!silent) {
      setIsInitialLoading(true);
    }

    try {
      await Promise.all([
        loadGoogleData(),
        loadPlatformData()
      ]);
      setLastRefresh(Date.now());
      setError(null);
    } catch (err) {
      console.error('Error refreshing data:', err);
      if (!silent) {
        setError('Failed to load data. Please try again.');
      }
    } finally {
      if (!silent) {
        setIsInitialLoading(false);
      }
    }
  };

  const loadGoogleData = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const apiClient = new ApiClient(token);
      const response = await apiClient.getGoogleOAuthToken();
      setGoogleToken(response.data);
    } catch (err) {
      console.log('No Google token found or error loading:', err);
      setGoogleToken(null);
    }
  };

  const loadPlatformData = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const apiClient = new ApiClient(token);
      const response = await apiClient.getPlatformData();
      setPlatformData(response.data);
    } catch (err) {
      console.log('Error loading platform data:', err);
      setPlatformData(null);
    }
  };

  const handleGoogleSignIn = () => {
    const googleAuthUrl = getGoogleAuthUrl();
    window.location.href = googleAuthUrl;
  };

  const handleGoogleSignOut = async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const apiClient = new ApiClient(token);
      await apiClient.deleteGoogleOAuthToken();
      setGoogleToken(null);
      setPlatformData(null);
      await refreshAllData(); // Refresh to get updated state
    } catch (err) {
      setError('Failed to sign out from Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/auth');
  };

  const startEditing = () => {
    setEditing({ isEditing: true });

    // Initialize form data with current values for all platforms
    if (platformData) {
      setFormData({
        google_analytics: {
          property_id: platformData.google_analytics.current.property_id || ''
        },
        google_search_console: {
          property_type: platformData.google_search_console.current?.property_type || '',
          property_name: platformData.google_search_console.current?.property_name || ''
        },
        google_ads: {
          manager_account_developer_token: platformData.google_ads.current.manager_account_developer_token || '',
          customer_account_id: platformData.google_ads.current.customer_account_id || ''
        }
      });
    }
  };

  const cancelEditing = () => {
    setEditing({ isEditing: false });
    setFormData({});
  };

  const saveChanges = async () => {
    const token = getToken();
    if (!token || !platformData) return;

    setIsLoading(true);
    try {
      // Build complete platform configuration with form data
      const updateData: PlatformUpdateRequest = {
        google_analytics: {
          property_id: formData.google_analytics?.property_id || ""
        },
        google_search_console: {
          property_type: formData.google_search_console?.property_type || "",
          property_name: formData.google_search_console?.property_name || ""
        },
        google_ads: {
          manager_account_developer_token: formData.google_ads?.manager_account_developer_token || "",
          customer_account_id: formData.google_ads?.customer_account_id || ""
        }
      };

      const apiClient = new ApiClient(token);
      await apiClient.updatePlatformData(updateData);

      // Refresh data immediately after successful save
      await refreshAllData();
      setEditing({ isEditing: false });
      setFormData({});
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save platform settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveGoogleAdsToken = async () => {
    const token = getToken();
    if (!token || !formData.google_ads?.manager_account_developer_token || !platformData) return;

    setIsGoogleAdsTokenSaving(true);
    try {
      // Build complete platform configuration with current values
      const updateData: PlatformUpdateRequest = {
        google_analytics: {
          property_id: formData.google_analytics?.property_id || platformData.google_analytics.current.property_id || ""
        },
        google_search_console: {
          property_type: formData.google_search_console?.property_type || platformData.google_search_console.current?.property_type || "",
          property_name: formData.google_search_console?.property_name || platformData.google_search_console.current?.property_name || ""
        },
        google_ads: {
          manager_account_developer_token: formData.google_ads.manager_account_developer_token,
          customer_account_id: formData.google_ads?.customer_account_id || platformData.google_ads.current.customer_account_id || ""
        }
      };

      const apiClient = new ApiClient(token);
      await apiClient.updatePlatformData(updateData);

      // Update form data to reflect the new token
      setFormData({
        ...formData,
        google_ads: {
          ...formData.google_ads,
          manager_account_developer_token: formData.google_ads.manager_account_developer_token
        }
      });

      // Refresh platform data to get the new options
      await refreshAllData();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save Google Ads developer token');
    } finally {
      setIsGoogleAdsTokenSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            {lastRefresh > 0 && (
              <span className="text-xs text-gray-500">
                Last updated: {new Date(lastRefresh).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => refreshAllData()}
              disabled={isInitialLoading}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg p-1"
              title="Refresh data"
            >
              <svg className={`w-4 h-4 ${isInitialLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg p-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {isInitialLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading settings...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User ID Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <code className="text-sm text-gray-800 font-mono">
                  {userId || 'Loading...'}
                </code>
              </div>
            </div>

            {/* Google Account Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Google Account</h3>

              {googleToken ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {googleToken.image_url ? (
                          <img
                            src={googleToken.image_url}
                            alt={googleToken.name}
                            className="w-12 h-12 rounded-full border-2 border-green-200 object-cover"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onLoad={() => {
                              console.log('Google profile image loaded successfully');
                            }}
                            onError={(e) => {
                              console.log('Google profile image failed to load:', googleToken.image_url);
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.classList.remove('hidden');
                              }
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200 ${googleToken.image_url ? 'hidden' : ''}`}>
                          <span className="text-green-700 font-semibold text-lg">
                            {googleToken.name?.charAt(0)?.toUpperCase() || 'G'}
                          </span>
                        </div>
                        {/* Online status indicator */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{googleToken.name}</p>
                        <p className="text-sm text-gray-600">{googleToken.email}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-green-700 font-medium">Connected to Google</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleGoogleSignOut}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? 'Signing Out...' : 'Sign Out'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Connect your Google account to access Analytics, Search Console, and Ads data.
                    </p>
                    <button
                      onClick={handleGoogleSignIn}
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign in with Google
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Platform Settings Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Settings</h3>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {!googleToken ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-600">
                    Please connect your Google account first to configure platform settings.
                  </p>
                </div>
              ) : platformData ? (
                <div className="space-y-4">
                  {/* Google Analytics */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Google Analytics</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                          platformData.google_analytics.connected 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {platformData.google_analytics.connected ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                    </div>

                    {editing.isEditing ? (
                      <select
                        value={formData.google_analytics?.property_id || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          google_analytics: { property_id: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a property</option>
                        {platformData.google_analytics.options.map((option) => (
                          <option key={option.property_id} value={option.property_id}>
                            {option.property_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          {platformData.google_analytics.connected
                            ? platformData.google_analytics.current.property_name
                            : 'No property selected'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Google Search Console */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Google Search Console</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                        platformData.google_search_console.connected 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {platformData.google_search_console.connected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>

                    {editing.isEditing ? (
                      <select
                        value={`${formData.google_search_console?.property_type || ''}|${formData.google_search_console?.property_name || ''}`}
                        onChange={(e) => {
                          const [property_type, property_name] = e.target.value.split('|');
                          setFormData({
                            ...formData,
                            google_search_console: { property_type, property_name }
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a property</option>
                        {platformData.google_search_console.options.map((option) => (
                          <option key={`${option.property_type}|${option.property_name}`} value={`${option.property_type}|${option.property_name}`}>
                            {option.property_name} ({option.property_type})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          {platformData.google_search_console.connected && platformData.google_search_console.current
                            ? `${platformData.google_search_console.current.property_name} (${platformData.google_search_console.current.property_type})`
                            : 'No property selected'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Google Ads */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Google Ads</h4>
                      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                        platformData.google_ads.connected 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {platformData.google_ads.connected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>

                    {editing.isEditing ? (
                      <div className="space-y-3">
                        {/* Developer Token Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Manager Account Developer Token
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={formData.google_ads?.manager_account_developer_token || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                google_ads: {
                                  ...formData.google_ads,
                                  manager_account_developer_token: e.target.value
                                }
                              })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter developer token"
                            />
                            <button
                              onClick={saveGoogleAdsToken}
                              disabled={isGoogleAdsTokenSaving || !formData.google_ads?.manager_account_developer_token}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                              {isGoogleAdsTokenSaving ? 'Saving...' : 'Set Token'}
                            </button>
                          </div>
                        </div>

                        {/* Customer Account Dropdown (only if options are available) */}
                        {platformData.google_ads.options.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Customer Account
                            </label>
                            <select
                              value={formData.google_ads?.customer_account_id || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                google_ads: {
                                  ...formData.google_ads,
                                  customer_account_id: e.target.value
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select customer account</option>
                              {platformData.google_ads.options.map((accountId) => (
                                <option key={accountId} value={accountId}>
                                  {accountId}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Developer Token:</span>{' '}
                            {platformData.google_ads.current.manager_account_developer_token
                              ? `${platformData.google_ads.current.manager_account_developer_token.substring(0, 10)}...`
                              : 'Not set'}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Customer Account:</span>{' '}
                            {platformData.google_ads.current.customer_account_id || 'Not selected'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edit and Save Buttons */}
                  {editing.isEditing ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={saveChanges}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <button
                        onClick={startEditing}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Edit Settings
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading platform data...</span>
                </div>
              )}
            </div>

            {/* Logout Section */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
