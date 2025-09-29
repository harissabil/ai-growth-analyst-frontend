import {ApiResponse, ChatHistory, GoogleOAuthResponse, PlatformResponse, PlatformUpdateRequest} from './types';

export class ApiClient {
    private baseUrl: string;
    private token?: string;

    constructor(token?: string) {
        this.baseUrl = process.env.UPSTREAM_API_BASE || 'http://127.0.0.1:8000';
        this.token = token;

        if (!this.baseUrl) {
            throw new Error('Missing UPSTREAM_API_BASE environment variable');
        }
    }

    private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        console.log('ApiClient making request to:', url);
        console.log('Headers:', headers);

        return fetch(url, {
            ...options,
            headers,
        });
    }

    async sendChatMessage(
        messages: { role: string; content: string }[],
        chatHistoryId?: string
    ): Promise<ApiResponse> {
        const url = new URL(`${this.baseUrl}/chat`);
        if (chatHistoryId) {
            url.searchParams.set('chat_history_id', chatHistoryId);
        }

        console.log('Sending to upstream API:', {
            url: url.toString(),
            messages: messages
        });

        const response = await this.makeRequest(url.toString(), {
            method: 'POST',
            body: JSON.stringify({messages}),
        });

        console.log('Upstream API response status:', response.status);

        const responseData = await response.json();
        console.log('Upstream API response data:', responseData);

        if (!response.ok) {
            throw new Error(`API Error: ${responseData.message || response.statusText}`);
        }

        return responseData;
    }

    async getChatHistories(): Promise<ChatHistory[]> {
        const url = new URL(`${this.baseUrl}/chat/histories`);

        const response = await this.makeRequest(url.toString());

        if (!response.ok) {
            throw new Error(`Failed to fetch chat histories: ${response.statusText}`);
        }

        return response.json();
    }

    async getChatHistory(chatHistoryId: string): Promise<{ messages: any[]; chat_history_id: string }> {
        const url = new URL(`${this.baseUrl}/chat/history/${chatHistoryId}`);

        const response = await this.makeRequest(url.toString());

        if (!response.ok) {
            throw new Error(`Failed to fetch chat history: ${response.statusText}`);
        }

        return response.json();
    }

    async deleteChatHistory(chatHistoryId: string): Promise<void> {
        const url = new URL(`${this.baseUrl}/chat/history/${chatHistoryId}`);

        const response = await this.makeRequest(url.toString(), {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete chat history: ${response.statusText}`);
        }
    }

    // Google OAuth methods
    async getGoogleOAuthToken(): Promise<GoogleOAuthResponse> {
        const authApiBase = process.env.NEXT_PUBLIC_UPSTREAM_AUTH_API_BASE;
        if (!authApiBase) {
            throw new Error('NEXT_PUBLIC_UPSTREAM_AUTH_API_BASE not configured');
        }
        const url = new URL(`${authApiBase}google-oauth`);

        const response = await this.makeRequest(url.toString());

        if (!response.ok) {
            throw new Error(`Failed to fetch Google OAuth token: ${response.statusText}`);
        }

        return response.json();
    }

    async deleteGoogleOAuthToken(): Promise<void> {
        const authApiBase = process.env.NEXT_PUBLIC_UPSTREAM_AUTH_API_BASE;
        if (!authApiBase) {
            throw new Error('NEXT_PUBLIC_UPSTREAM_AUTH_API_BASE not configured');
        }
        const url = new URL(`${authApiBase}google-oauth`);

        const response = await this.makeRequest(url.toString(), {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete Google OAuth token: ${response.statusText}`);
        }
    }

    // Platform management methods
    async getPlatformData(): Promise<PlatformResponse> {
        const authApiBase = process.env.NEXT_PUBLIC_UPSTREAM_AUTH_API_BASE;
        if (!authApiBase) {
            throw new Error('NEXT_PUBLIC_UPSTREAM_AUTH_API_BASE not configured');
        }
        const url = new URL(`${authApiBase}platform`);

        const response = await this.makeRequest(url.toString());

        if (!response.ok) {
            throw new Error(`Failed to fetch platform data: ${response.statusText}`);
        }

        return response.json();
    }

    async updatePlatformData(data: PlatformUpdateRequest): Promise<void> {
        const authApiBase = process.env.NEXT_PUBLIC_UPSTREAM_AUTH_API_BASE;
        if (!authApiBase) {
            throw new Error('NEXT_PUBLIC_UPSTREAM_AUTH_API_BASE not configured');
        }
        const url = new URL(`${authApiBase}platform`);

        const response = await this.makeRequest(url.toString(), {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to update platform data: ${response.statusText}`);
        }
    }
}
