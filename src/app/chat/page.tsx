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
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">AI Growth Analyst</h1>
          <a
            href="/history"
            className="px-3 py-1 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors text-sm"
          >
            History
          </a>
        </div>
      </header>

      <ErrorBanner error={error} onDismiss={dismissError} />

      <div className="flex-1 flex flex-col min-h-0">
        <ChatThread messages={thread} />
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
