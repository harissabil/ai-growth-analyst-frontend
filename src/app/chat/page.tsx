'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/lib/types';
import { ChatRepo } from '@/lib/store/chat-repo';
import ChatThread from '@/components/ChatThread';
import ChatInput from '@/components/ChatInput';
import ErrorBanner from '@/components/ErrorBanner';
import Image from 'next/image';

export default function ChatPage() {
    const [thread, setThread] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestionText, setSuggestionText] = useState<string>('');

    const handleSuggestionClick = (suggestion: string) => {
        setSuggestionText(suggestion);
        // Clear the suggestion after a brief moment to allow the input to update
        setTimeout(() => setSuggestionText(''), 100);
    };

    const handleSendMessage = async (content: string) => {
        if (isLoading) return;

        const userMessage: Message = { role: 'user', content };
        const newThread = [...thread, userMessage];

        setThread(newThread);
        setIsLoading(true);
        setError(null);

        // Add loading indicator for AI response
        const loadingMessage: Message = { role: 'assistant', content: 'Thinking...' };
        setThread([...newThread, loadingMessage]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: newThread }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data); // Debug log

            if (data.messages && data.messages.length > 0) {
                // Convert all API messages to our Message format
                const apiMessages: Message[] = data.messages.map((msg: any) => ({
                    role: msg.role,
                    content: msg.content,
                    tables: msg.tables || null,
                }));

                // Find where our conversation starts (after our user message)
                const userMessageIndex = apiMessages.findLastIndex((msg: Message) =>
                    msg.role === 'user' && msg.content === content
                );

                if (userMessageIndex >= 0) {
                    // Get only the new messages (after our user message)
                    const newMessages = apiMessages.slice(userMessageIndex + 1);

                    if (newMessages.length > 0) {
                        // Add all new assistant messages to the thread
                        const finalThread = [...newThread, ...newMessages];
                        setThread(finalThread);

                        // Save conversation to localStorage
                        const turn = ChatRepo.newTurnFromThread(finalThread);
                        ChatRepo.saveTurn(turn);
                    } else {
                        throw new Error('No assistant response found');
                    }
                } else {
                    // Fallback: if we can't find our user message, just take all assistant messages
                    const assistantMessages = apiMessages.filter((msg: Message) => msg.role === 'assistant');
                    if (assistantMessages.length > 0) {
                        const finalThread = [...newThread, ...assistantMessages];
                        setThread(finalThread);

                        // Save conversation to localStorage
                        const turn = ChatRepo.newTurnFromThread(finalThread);
                        ChatRepo.saveTurn(turn);
                    } else {
                        throw new Error('No assistant response found');
                    }
                }
            } else {
                throw new Error('No response from AI service');
            }
        } catch (err) {
            console.error('Chat error:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            // Remove loading message on error
            setThread(newThread);
        } finally {
            setIsLoading(false);
        }
    };

    const dismissError = () => setError(null);

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="bg-white border-b border-gray-200 px-6 py-4 swo-shadow">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <Image
                                src="/logo_swo.png"
                                alt="SoftwareOne"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                            <div className="h-8 w-px bg-gray-300"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-black">
                                AI-Powered Growth Analyst
                            </h1>
                            <p className="text-sm text-gray-600">by SoftwareOne</p>
                        </div>
                    </div>
                    <a
                        href="/history"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 hover:border-gray-300 swo-shadow hover:swo-shadow-md"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>History</span>
                    </a>
                </div>
            </header>

            <ErrorBanner error={error} onDismiss={dismissError} />

            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto w-full px-6">
                        <ChatThread messages={thread} onSuggestionClick={handleSuggestionClick} />
                    </div>
                </div>
                <div className="max-w-5xl mx-auto w-full px-6">
                    <ChatInput onSend={handleSendMessage} isLoading={isLoading} suggestionText={suggestionText} />
                </div>
            </div>
        </div>
    );
}
