import {NextRequest, NextResponse} from 'next/server';
import {ApiClient} from '@/lib/api-client';

export async function GET(request: NextRequest) {
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

        // Create API client with the token
        const apiClient = new ApiClient(token);
        const histories = await apiClient.getChatHistories();

        return NextResponse.json(histories);
    } catch (error) {
        console.error('Chat histories API error:', error);

        if (error instanceof Error) {
            if (error.message.includes('Unauthorized') || error.message.includes('403')) {
                return NextResponse.json(
                    {code: 401, message: 'Unauthorized'},
                    {status: 401}
                );
            }
        }

        return NextResponse.json(
            {code: 502, message: 'Failed to communicate with AI service'},
            {status: 502}
        );
    }
}
