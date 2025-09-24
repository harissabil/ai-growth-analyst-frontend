import {NextRequest, NextResponse} from 'next/server';
import {ApiClient} from '@/lib/api-client';

export async function GET(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    try {
        // Extract the Authorization header from the incoming request
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                {code: 401, message: 'Authorization token required'},
                {status: 401}
            );
        }

        const chatHistoryId = params.id;

        // Create API client with the token
        const apiClient = new ApiClient(token);
        const history = await apiClient.getChatHistory(chatHistoryId);

        return NextResponse.json(history);
    } catch (error) {
        console.error('Chat history API error:', error);

        if (error instanceof Error) {
            if (error.message.includes('Unauthorized') || error.message.includes('403')) {
                return NextResponse.json(
                    {code: 401, message: 'Unauthorized'},
                    {status: 401}
                );
            }
            if (error.message.includes('Chat history not found') || error.message.includes('404')) {
                return NextResponse.json(
                    {code: 404, message: 'Chat history not found'},
                    {status: 404}
                );
            }
        }

        return NextResponse.json(
            {code: 502, message: 'Failed to communicate with AI service'},
            {status: 502}
        );
    }
}

export async function DELETE(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    try {
        // Extract the Authorization header from the incoming request
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                {code: 401, message: 'Authorization token required'},
                {status: 401}
            );
        }

        const chatHistoryId = params.id;

        // Create API client with the token
        const apiClient = new ApiClient(token);
        await apiClient.deleteChatHistory(chatHistoryId);

        return NextResponse.json({success: true});
    } catch (error) {
        console.error('Delete chat history API error:', error);

        if (error instanceof Error) {
            if (error.message.includes('Unauthorized') || error.message.includes('403')) {
                return NextResponse.json(
                    {code: 401, message: 'Unauthorized'},
                    {status: 401}
                );
            }
            if (error.message.includes('Chat history not found') || error.message.includes('404')) {
                return NextResponse.json(
                    {code: 404, message: 'Chat history not found'},
                    {status: 404}
                );
            }
        }

        return NextResponse.json(
            {code: 502, message: 'Failed to communicate with AI service'},
            {status: 502}
        );
    }
}
