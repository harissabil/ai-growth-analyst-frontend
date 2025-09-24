'use client';

import {useState, useEffect, Suspense} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {Message} from '@/lib/types';
import ChatThread from '@/components/ChatThread';
import ChatInput from '@/components/ChatInput';
import ErrorBanner from '@/components/ErrorBanner';
import Settings from '@/components/Settings';
import { isAuthenticated, getUserId } from '@/lib/auth';
import Image from 'next/image';

function ChatPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const historyId = searchParams?.get('history_id');

    const [thread, setThread] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestionText, setSuggestionText] = useState<string>('');
    const [currentChatHistoryId, setCurrentChatHistoryId] = useState<string | undefined>(historyId || undefined);
    const [isLoadingHistory, setIsLoadingHistory] = useState(!!historyId);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/auth');
            return;
        }
    }, [router]);

    // Only load history on initial mount if historyId is present
    useEffect(() => {
        if (historyId) {
            loadChatHistory(historyId);
        }
    }, []); // Empty dependency array - only run on mount

    const loadChatHistory = async (chatHistoryId: string) => {
        try {
            const userId = getUserId();
            if (!userId) {
                router.push('/auth');
                return;
            }

            const response = await fetch(`/api/chat/history/${chatHistoryId}?user_id=${userId}`);

            if (!response.ok) {
                throw new Error('Failed to load chat history');
            }

            const data = await response.json();

            if (data.messages && Array.isArray(data.messages)) {
                const messages: Message[] = data.messages.map((msg: any) => ({
                    role: msg.role,
                    content: msg.content,
                    tables: msg.tables || null,
                }));
                setThread(messages);
                setCurrentChatHistoryId(data.chat_history_id);
            }
        } catch (err) {
            console.error('Failed to load chat history:', err);
            setError('Failed to load chat history');
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSuggestionText(suggestion);
        setTimeout(() => setSuggestionText(''), 100);
    };

    const handleSendMessage = async (content: string) => {
        if (isLoading) return;

        const userMessage: Message = {role: 'user', content};
        const newThread = [...thread, userMessage];

        setThread(newThread);
        setIsLoading(true);
        setError(null);

        // Add loading indicator for AI response
        const loadingMessage: Message = {role: 'assistant', content: 'Thinking...'};
        setThread([...newThread, loadingMessage]);

        try {
            const userId = getUserId();
            if (!userId) {
                router.push('/auth');
                return;
            }

            const url = new URL('/api/chat', window.location.origin);
            if (currentChatHistoryId) {
                url.searchParams.set('chat_history_id', currentChatHistoryId);
            }
            url.searchParams.set('user_id', userId);

            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({messages: newThread}),
            });

            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (parseError) {
                    // If we can't parse the error response, use the status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.messages && data.messages.length > 0) {
                // Set the chat history ID if we got one back (for new conversations)
                if (data.chat_history_id && !currentChatHistoryId) {
                    setCurrentChatHistoryId(data.chat_history_id);
                    // Update URL to include history_id without page reload
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set('history_id', data.chat_history_id);
                    window.history.replaceState({}, '', newUrl.toString());
                }

                // Convert API messages to our Message format
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
                    } else {
                        throw new Error('No assistant response found');
                    }
                } else {
                    // Fallback: if we can't find our user message, just take all assistant messages
                    const assistantMessages = apiMessages.filter((msg: Message) => msg.role === 'assistant');
                    if (assistantMessages.length > 0) {
                        const finalThread = [...newThread, ...assistantMessages];
                        setThread(finalThread);
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

    if (isLoadingHistory) {
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>History</span>
                        </a>
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading chat history...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                    <div className="flex items-center space-x-3">
                        {currentChatHistoryId && (
                            <a
                                href="/chat"
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 hover:border-gray-300 swo-shadow hover:swo-shadow-md"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                                <span>New Chat</span>
                            </a>
                        )}
                        <a
                            href="/history"
                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 hover:border-gray-300 swo-shadow hover:swo-shadow-md"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>History</span>
                        </a>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium border border-gray-200 hover:border-gray-300 swo-shadow hover:swo-shadow-md"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <span>Settings</span>
                        </button>
                    </div>
                </div>
            </header>

            <ErrorBanner error={error} onDismiss={dismissError}/>

            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-5xl mx-auto w-full px-6">
                        <ChatThread messages={thread} onSuggestionClick={handleSuggestionClick}/>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto w-full px-6">
                    <ChatInput onSend={handleSendMessage} isLoading={isLoading} suggestionText={suggestionText}/>
                </div>
            </div>

            <Settings
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}

function LoadingFallback() {
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>History</span>
                    </a>
                </div>
            </header>
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<LoadingFallback/>}>
            <ChatPageContent/>
        </Suspense>
    );
}
