import { useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import ChatMessage from './ChatMessage';

interface ChatThreadProps {
  messages: Message[];
}

export default function ChatThread({ messages }: ChatThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">AI Growth Analyst</p>
            <p>Start a conversation by typing a message below</p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
