'use client';

import {useState, useEffect} from 'react';
import {ChatHistory} from '@/lib/types';
import Image from 'next/image';

export default function HistoryPage() {
    const [histories, setHistories] = useState<ChatHistory[]>([]);
    const [selectedHistory, setSelectedHistory] = useState<ChatHistory | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        loadHistories();
    }, []);

    const loadHistories = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/chat/histories?user_id=anonymous');

            if (!response.ok) {
                throw new Error('Failed to load chat histories');
            }

            const data = await response.json();
            setHistories(data);
        } catch (err) {
            console.error('Failed to load histories:', err);
            setError('Failed to load chat histories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteHistory = async (historyId: string) => {
        if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
            return;
        }

        try {
            setIsDeleting(historyId);
            const response = await fetch(`/api/chat/history/${historyId}?user_id=anonymous`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete chat history');
            }

            // Remove from local state
            setHistories(histories.filter(h => h.chat_history_id !== historyId));

            if (selectedHistory?.chat_history_id === historyId) {
                setSelectedHistory(null);
            }
        } catch (err) {
            console.error('Failed to delete history:', err);
            setError('Failed to delete chat history');
        } finally {
            setIsDeleting(null);
        }
    };

    const formatDate = (dateString: string) => {
        // Parse the UTC date and convert to local timezone
        const utcDate = new Date(dateString + (dateString.includes('Z') ? '' : 'Z'));
        return utcDate.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getPreview = (title: string) => {
        return title.length > 80 ? title.slice(0, 80) + '...' : title;
    };

    const dismissError = () => setError(null);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
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
                                <div className="h-6 w-px bg-gray-300"></div>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-black">Chat History</h1>
                                <p className="text-sm text-gray-600">AI-Powered Growth Analyst by SoftwareOne</p>
                            </div>
                        </div>
                        <a
                            href="/chat"
                            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium swo-shadow-md hover:swo-shadow-lg transform hover:scale-105"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            <span>New Chat</span>
                        </a>
                    </div>
                </header>
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading chat histories...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
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
                            <div className="h-6 w-px bg-gray-300"></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-black">Chat History</h1>
                            <p className="text-sm text-gray-600">AI-Powered Growth Analyst by SoftwareOne</p>
                        </div>
                    </div>
                    <a
                        href="/chat"
                        className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium swo-shadow-md hover:swo-shadow-lg transform hover:scale-105"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        <span>New Chat</span>
                    </a>
                </div>
            </header>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-6 mt-4">
                    <div className="flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={dismissError}
                            className="ml-4 text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto p-6">
                {histories.length === 0 ? (
                    <div className="text-center py-16">
                        <div
                            className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-3">No Chat History</h2>
                        <p className="text-gray-600 mb-6">You haven&#39;t started any conversations yet</p>
                        <a
                            href="/chat"
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium swo-shadow-md hover:swo-shadow-lg transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                            <span>Start Your First Chat</span>
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-black mb-2">Recent Conversations</h2>
                            <p className="text-gray-600">Click on any conversation to continue or view the full chat
                                history</p>
                        </div>
                        {histories.map((history) => (
                            <div
                                key={history.chat_history_id}
                                className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:bg-gray-100 hover:swo-shadow-md transition-all duration-200 group"
                            >
                                <div className="flex justify-between items-start">
                                    <div
                                        className="flex-1 cursor-pointer"
                                        onClick={() => window.location.href = `/chat?history_id=${history.chat_history_id}`}
                                    >
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div
                                                className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-black font-semibold">Conversation</p>
                                                <p className="text-gray-500 text-sm">{formatDate(history.created_at)}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-800 mb-3 leading-relaxed">{getPreview(history.title)}</p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                                </svg>
                                                <span>{history.message_count} messages</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                <span>Updated {formatDate(history.updated_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/chat?history_id=${history.chat_history_id}`;
                                            }}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Continue conversation"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteHistory(history.chat_history_id);
                                            }}
                                            disabled={isDeleting === history.chat_history_id}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete conversation"
                                        >
                                            {isDeleting === history.chat_history_id ? (
                                                <div
                                                    className="w-4 h-4 animate-spin border-2 border-red-600 border-t-transparent rounded-full"></div>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
