'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/lib/types';
import { ChatRepo } from '@/lib/store/chat-repo';
import ChatThread from '@/components/ChatThread';
import ChatInput from '@/components/ChatInput';
import ErrorBanner from '@/components/ErrorBanner';

export default function ChatPage() {
  const [thread, setThread] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        // The API returns the full conversation history, so we need to get the last assistant message
        const assistantResponses = data.messages.filter((msg: any) => msg.role === 'assistant');
        const latestAssistantResponse = assistantResponses[assistantResponses.length - 1];

        if (latestAssistantResponse) {
          const assistantMessage: Message = {
            role: 'assistant',
            content: latestAssistantResponse.content,
          };

          const finalThread = [...newThread, assistantMessage];
          setThread(finalThread);

          // Save conversation to localStorage
          const turn = ChatRepo.newTurnFromThread(finalThread);
          ChatRepo.saveTurn(turn);
        } else {
          throw new Error('No assistant response found');
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Growth Analyst
              </h1>
              <p className="text-sm text-gray-500">Your intelligent business companion</p>
            </div>
          </div>
          <a
            href="/history"
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 text-sm font-medium border border-blue-200/50 hover:border-blue-300 hover:shadow-sm"
          >
            📈 History
          </a>
        </div>
      </header>

      <ErrorBanner error={error} onDismiss={dismissError} />

      <div className="flex-1 flex flex-col min-h-0 max-w-4xl mx-auto w-full px-4">
        <ChatThread messages={thread} />
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
