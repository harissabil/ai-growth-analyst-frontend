import { NextRequest, NextResponse } from 'next/server';
import { ApiClient } from '@/lib/api-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { code: 400, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const apiClient = new ApiClient();
    const histories = await apiClient.getChatHistories(userId);

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
