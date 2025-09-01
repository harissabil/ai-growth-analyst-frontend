import { NextRequest, NextResponse } from 'next/server';
import { ApiClient } from '@/lib/api-client';
import { Message } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { code: 400, message: 'Messages array is required' },
        { status: 400 }
      );
    }

    const apiClient = new ApiClient();
    const response = await apiClient.sendChatMessage(body.messages);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        return NextResponse.json(
          { code: 401, message: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { code: 502, message: 'Failed to communicate with AI service' },
      { status: 502 }
    );
  }
}
