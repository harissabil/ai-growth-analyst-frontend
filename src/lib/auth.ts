// Authentication utilities for Microsoft Entra ID OAuth flow
export interface AuthUser {
  user_id: string;
  token: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user_id: string;
    token: string;
  };
}

export interface AuthError {
  errors: string;
}

// Token management
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_id');
}

export function setUserId(userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user_id', userId);
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_id');
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

// Generate Microsoft OAuth URL
export function getMicrosoftAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
  const redirectUri = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_REDIRECT_URI_PROD!
    : process.env.NEXT_PUBLIC_REDIRECT_URI!;

  const state = generateRandomState();
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    response_mode: 'query',
    state,
  });

  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params.toString()}`;
}

function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// API fetch wrapper with authentication
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    // @ts-ignore
      headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If we get a 401, the token is invalid/expired
  if (response.status === 401) {
    clearAuth();
    window.location.href = '/auth';
  }

  return response;
}

// Exchange authorization code for token
export async function exchangeCodeForToken(code: string): Promise<AuthResponse> {
  const authApiBase = process.env.UPSTREAM_AUTH_API_BASE;
  if (!authApiBase) {
    throw new Error('UPSTREAM_AUTH_API_BASE not configured');
  }

  const response = await fetch(`${authApiBase}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors || 'Authentication failed');
  }

  return data;
}
