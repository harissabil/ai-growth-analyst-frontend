import { ApiResponse, ChatHistory } from './types';

export class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.UPSTREAM_API_BASE || '';
    this.apiKey = process.env.UPSTREAM_API_KEY || '';

    if (!this.baseUrl || !this.apiKey) {
      throw new Error('Missing UPSTREAM_API_BASE or UPSTREAM_API_KEY environment variables');
    }
  }

  async sendChatMessage(
    messages: { role: string; content: string }[],
    chatHistoryId?: string,
    userId?: string
  ): Promise<ApiResponse> {
    const url = new URL(`${this.baseUrl}/chat`);
    if (chatHistoryId) {
      url.searchParams.set('chat_history_id', chatHistoryId);
    }
    if (userId) {
      url.searchParams.set('user_id', userId);
    }

    console.log('Sending to upstream API:', {
      url: url.toString(),
      messages: messages
    });

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ messages }),
    });

    console.log('Upstream API response status:', response.status);

    const responseData = await response.json();
    console.log('Upstream API response data:', responseData);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }

      // Try to get error details from response (responseData is already parsed)
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      if (responseData.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        errorMessage = responseData.errors[0];
      } else if (responseData.message) {
        errorMessage = responseData.message;
      }

      throw new Error(errorMessage);
    }

    return responseData;
  }

  async getChatHistory(chatHistoryId: string, userId?: string): Promise<ApiResponse> {
    const url = new URL(`${this.baseUrl}/chat/history/${chatHistoryId}`);
    if (userId) {
      url.searchParams.set('user_id', userId);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Chat history not found');
      }
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async listChatHistories(userId: string = 'anonymous', limit: number = 20, offset: number = 0): Promise<ChatHistory[]> {
    const url = new URL(`${this.baseUrl}/chat/histories`);
    url.searchParams.set('user_id', userId);
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('offset', offset.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async deleteChatHistory(chatHistoryId: string, userId?: string): Promise<void> {
    const url = new URL(`${this.baseUrl}/chat/history/${chatHistoryId}`);
    if (userId) {
      url.searchParams.set('user_id', userId);
    }

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Chat history not found');
      }
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
  }
}

export function assertOk(response: Response): asserts response is Response & { ok: true } {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
}

export function parseApiResponse(json: any): ApiResponse {
  if (!json || !Array.isArray(json.messages)) {
    throw new Error('Invalid API response format');
  }
  return json as ApiResponse;
}
