import { ApiResponse } from './types';

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

  async sendChatMessage(messages: { role: string; content: string }[]): Promise<ApiResponse> {
    console.log('Sending to upstream API:', {
      url: `${this.baseUrl}/chat`,
      messages: messages
    });

    const response = await fetch(`${this.baseUrl}/chat`, {
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
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return responseData;
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
