'use client';

import { useState, useEffect } from 'react';
import { ChatTurn } from '@/lib/types';
import { ChatRepo } from '@/lib/store/chat-repo';
import ChatMessage from '@/components/ChatMessage';

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
    return firstUserMessage?.content.slice(0, 60) + '...' || 'No messages';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Chat History</h1>
          <a
            href="/chat"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            New Chat
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {turns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No chat history found</p>
            <a
              href="/chat"
              className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Your First Chat
            </a>
          </div>
        ) : (
          <div className="grid gap-4">
            {turns.map((turn) => (
              <div
                key={turn.id}
                className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTurn(turn)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{getPreview(turn)}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {turn.messages.length} messages • {formatDate(turn.createdAt)}
                    </p>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Click to view
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                Chat from {formatDate(selectedTurn.createdAt)}
              </h2>
              <button
                onClick={() => setSelectedTurn(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {selectedTurn.messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
            </div>
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setSelectedTurn(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
