import { NextRequest, NextResponse } from 'next/server';
import { ApiClient } from '@/lib/api-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || 'anonymous';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const apiClient = new ApiClient();
    const histories = await apiClient.listChatHistories(userId, limit, offset);

    return NextResponse.json(histories);
  } catch (error) {
    console.error('Chat histories API error:', error);

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
