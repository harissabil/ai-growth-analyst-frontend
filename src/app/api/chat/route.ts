import {NextRequest, NextResponse} from 'next/server';
import {ApiClient} from '@/lib/api-client';

export async function POST(request: NextRequest) {
    let chatHistoryId: string | undefined;

    try {
        const body = await request.json();
        const {searchParams} = new URL(request.url);

        // Get user_id from query params (should be the actual user ID from auth)
        chatHistoryId = searchParams.get('chat_history_id') || undefined;
        const userId = searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json(
                {code: 400, message: 'User ID is required'},
                {status: 400}
            );
        }

        if (!body.messages || !Array.isArray(body.messages)) {
            return NextResponse.json(
                {code: 400, message: 'Messages array is required'},
                {status: 400}
            );
        }

        const apiClient = new ApiClient();
        const response = await apiClient.sendChatMessage(
            body.messages,
            chatHistoryId,
            userId
        );

        return NextResponse.json(response);
    } catch (error) {
        console.error('Chat API error:', error);

        if (error instanceof Error) {
            if (error.message === 'UNAUTHORIZED') {
                return NextResponse.json(
                    {code: 401, message: 'Unauthorized access. Please check your credentials.'},
                    {status: 401}
                );
            }

            // Handle backend errors gracefully with user-friendly messages
            let userMessage = 'Something went wrong while processing your request. Please try rephrasing your message or contact support if the issue persists.';

            if (error.message.includes('Internal server error during chat processing')) {
                userMessage = 'I apologize, but I cannot process this request. This might be due to content restrictions or system limitations. Please try rephrasing your message in a different way.';
            } else if (error.message.includes('API request failed: 500')) {
                userMessage = 'The AI service is temporarily unavailable. Please try again in a moment or rephrase your question.';
            } else if (error.message.includes('timeout') || error.message.includes('TIMEOUT')) {
                userMessage = 'The request took too long to process. Please try with a shorter message or try again later.';
            } else if (error.message.includes('rate limit') || error.message.includes('RATE_LIMIT')) {
                userMessage = 'Too many requests have been made. Please wait a moment before trying again.';
            }

            return NextResponse.json(
                {code: 500, message: userMessage},
                {status: 500}
            );
        }

        return NextResponse.json(
            {code: 500, message: 'An unexpected error occurred'},
            {status: 500}
        );
    }
}
