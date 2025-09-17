import { NextRequest, NextResponse } from 'next/server';
import { ApiClient } from '@/lib/api-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || 'anonymous';
    const chatHistoryId = params.id;

    const apiClient = new ApiClient();
    const history = await apiClient.getChatHistory(chatHistoryId, userId);

    return NextResponse.json(history);
  } catch (error) {
    console.error('Chat history API error:', error);

    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        return NextResponse.json(
          { code: 401, message: 'Unauthorized' },
          { status: 401 }
        );
      }
      if (error.message === 'Chat history not found') {
        return NextResponse.json(
          { code: 404, message: 'Chat history not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { code: 502, message: 'Failed to communicate with AI service' },
      { status: 502 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || 'anonymous';
    const chatHistoryId = params.id;

    const apiClient = new ApiClient();
    await apiClient.deleteChatHistory(chatHistoryId, userId);

    return NextResponse.json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    console.error('Delete chat history API error:', error);

    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        return NextResponse.json(
          { code: 401, message: 'Unauthorized' },
          { status: 401 }
        );
      }
      if (error.message === 'Chat history not found') {
        return NextResponse.json(
          { code: 404, message: 'Chat history not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { code: 502, message: 'Failed to communicate with AI service' },
      { status: 502 }
    );
  }
}
