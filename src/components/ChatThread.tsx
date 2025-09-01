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
    <div className="flex-1 overflow-y-auto p-6 space-y-2">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to AI Growth Analyst</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Get intelligent insights about your business growth, analytics data, and performance metrics.
              Ask me anything about your data!
            </p>
            <div className="grid grid-cols-1 gap-3 text-left">
              <div className="bg-white/60 border border-gray-200/50 rounded-xl p-4 hover:bg-white/80 transition-all duration-200 cursor-pointer hover:shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Traffic Analysis</p>
                    <p className="text-sm text-gray-500">Get insights about website traffic and user behavior</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 border border-gray-200/50 rounded-xl p-4 hover:bg-white/80 transition-all duration-200 cursor-pointer hover:shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Growth Metrics</p>
                    <p className="text-sm text-gray-500">Analyze growth trends and performance indicators</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 border border-gray-200/50 rounded-xl p-4 hover:bg-white/80 transition-all duration-200 cursor-pointer hover:shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Smart Recommendations</p>
                    <p className="text-sm text-gray-500">Get AI-powered suggestions for optimization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          {messages.map((message, index) => (
            <div key={index} className="animate-in slide-in-from-bottom duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <ChatMessage message={message} />
            </div>
          ))}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
