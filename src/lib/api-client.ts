import { ApiResponse, ChatHistory } from './types';
import { apiFetch, getUserId } from './auth';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.UPSTREAM_API_BASE || '';

    if (!this.baseUrl) {
      throw new Error('Missing UPSTREAM_API_BASE environment variable');
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

    const response = await apiFetch(url.toString(), {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });

    console.log('Upstream API response status:', response.status);

    const responseData = await response.json();
    console.log('Upstream API response data:', responseData);

    if (!response.ok) {
      throw new Error(`API Error: ${responseData.message || response.statusText}`);
    }

    return responseData;
  }

  async getChatHistories(userId: string): Promise<ChatHistory[]> {
    const url = new URL(`${this.baseUrl}/chat/histories`);
    url.searchParams.set('user_id', userId);

    const response = await apiFetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch chat histories: ${response.statusText}`);
    }

    return response.json();
  }

  async getChatHistory(chatHistoryId: string, userId: string): Promise<{ messages: any[]; chat_history_id: string }> {
    const url = new URL(`${this.baseUrl}/chat/history/${chatHistoryId}`);
    url.searchParams.set('user_id', userId);

    const response = await apiFetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch chat history: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteChatHistory(chatHistoryId: string, userId: string): Promise<void> {
    const url = new URL(`${this.baseUrl}/chat/history/${chatHistoryId}`);
    url.searchParams.set('user_id', userId);

    const response = await apiFetch(url.toString(), {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete chat history: ${response.statusText}`);
    }
  }
}
