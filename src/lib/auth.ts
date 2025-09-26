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
    const token = localStorage.getItem('auth_token');
    console.log('Getting token from localStorage:', token ? 'Token found' : 'No token found');
    if (token) {
        console.log('Token preview:', token.substring(0, 50) + '...');
    }
    return token;
}

export function setToken(token: string): void {
    if (typeof window === 'undefined') return;
    console.log('Storing token to localStorage:', token ? 'Token being stored' : 'No token to store');
    console.log('Token value:', token);
    localStorage.setItem('auth_token', token);
}

export function getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    const userId = localStorage.getItem('user_id');
    console.log('Getting user_id from localStorage:', userId ? userId : 'No user_id found');
    return userId;
}

export function setUserId(userId: string): void {
    if (typeof window === 'undefined') return;
    console.log('Storing user_id to localStorage:', userId);
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
        prompt: 'select_account'
    });

    return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params.toString()}`;
}

function generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// API fetch wrapper with authentication
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
    console.log('apiFetch called for URL:', url);

    // Check if we're running on the server side
    if (typeof window === 'undefined') {
        console.error('❌ apiFetch called on server-side - localStorage not available');
        // For server-side calls, we need to get the token from the request headers
        // This should not happen with our current architecture
        throw new Error('apiFetch should not be called server-side');
    }

    // Get token with detailed logging
    const token = getToken();
    console.log('Token retrieved in apiFetch:', token ? `${token.substring(0, 50)}...` : 'NULL');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        console.error('❌ NO TOKEN AVAILABLE - Cannot set Authorization header');
        // Let's check localStorage directly
        console.log('Direct localStorage check:', localStorage.getItem('auth_token') ? 'Token exists' : 'No token');
    }

    console.log('Final headers being sent:', headers);

    const response = await fetch(url, {
        ...options,
        headers,
    });

    console.log('Response status:', response.status);

    // If we get a 401, the token is invalid/expired
    if (response.status === 401) {
        console.log('Got 401, clearing auth and redirecting');
        clearAuth();
        window.location.href = '/auth';
        return response;
    }

    return response;
}

// Exchange authorization code for token
export async function exchangeCodeForToken(code: string): Promise<AuthResponse> {
    const authApiBase = process.env.NEXT_PUBLIC_UPSTREAM_AUTH_API_BASE;
    if (!authApiBase) {
        throw new Error('NEXT_PUBLIC_UPSTREAM_AUTH_API_BASE not configured');
    }

    const response = await fetch(`${authApiBase}auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({code}),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.errors || 'Authentication failed');
    }

    return data;
}
