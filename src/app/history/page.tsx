'use client';

import { useState, useEffect } from 'react';
import { ChatTurn } from '@/lib/types';
import { ChatRepo } from '@/lib/store/chat-repo';
import ChatMessage from '@/components/ChatMessage';
import Image from 'next/image';

export default function HistoryPage() {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [selectedTurn, setSelectedTurn] = useState<ChatTurn | null>(null);

  useEffect(() => {
    const loadedTurns = ChatRepo.loadAll();
    setTurns(loadedTurns.sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPreview = (turn: ChatTurn) => {
    const firstUserMessage = turn.messages.find(m => m.role === 'user');
    return firstUserMessage?.content.slice(0, 80) + '...' || 'No messages';
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4 swo-shadow">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo_swo.png"
                alt="SoftwareOne"
                width={32}
                height={32}
                className="object-contain"
              />
              <div className="h-6 w-px bg-gray-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">Chat History</h1>
              <p className="text-sm text-gray-600">AI-Powered Growth Analyst by SoftwareOne</p>
            </div>
          </div>
          <a
            href="/chat"
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium swo-shadow-md hover:swo-shadow-lg transform hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Chat</span>
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {turns.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-black mb-3">No Chat History</h2>
            <p className="text-gray-600 mb-6">You haven't started any conversations yet</p>
            <a
              href="/chat"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium swo-shadow-md hover:swo-shadow-lg transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Start Your First Chat</span>
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-black mb-2">Recent Conversations</h2>
              <p className="text-gray-600">Click on any conversation to view the full chat history</p>
            </div>
            {turns.map((turn) => (
              <div
                key={turn.id}
                className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:bg-gray-100 hover:swo-shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedTurn(turn)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-black font-semibold">Conversation</p>
                        <p className="text-gray-500 text-sm">{formatDate(turn.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium leading-relaxed mb-3">{getPreview(turn)}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{turn.messages.length} messages</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for viewing conversation */}
      {selectedTurn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col swo-shadow-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-black">
                  Chat History
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {formatDate(selectedTurn.createdAt)} • {selectedTurn.messages.length} messages
                </p>
              </div>
              <button
                onClick={() => setSelectedTurn(null)}
                className="text-gray-600 hover:text-black hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {selectedTurn.messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">End of conversation</p>
                <button
                  onClick={() => setSelectedTurn(null)}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium swo-shadow hover:swo-shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
