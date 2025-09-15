import { useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import ChatMessage from './ChatMessage';

interface ChatThreadProps {
  messages: Message[];
  onSuggestionClick?: (suggestion: string) => void;
}

export default function ChatThread({ messages, onSuggestionClick }: ChatThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestions = [
    {
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9z",
      title: "Show overall traffic for last month",
      description: "Get total sessions and page views"
    },
    {
      icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      title: "Top 10 countries by traffic last week",
      description: "See which countries visited most"
    },
    {
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      title: "Top keywords in Google Search Console yesterday",
      description: "Most searched keywords that found you"
    },
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
      title: "Google Ads performance last month",
      description: "Spending, clicks, and conversion rates"
    },
    {
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      title: "Top 10 pages by traffic this month",
      description: "Your most visited pages"
    },
    {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Daily traffic breakdown for last 7 days",
      description: "See traffic trends day by day"
    }
  ];

  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto py-6 space-y-2">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center min-h-full px-4 py-8">
          <div className="text-center max-w-6xl mx-auto w-full">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-8 swo-shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
              Welcome to AI-Powered Growth Analyst
            </h2>
            <p className="text-gray-600 mb-12 leading-relaxed text-lg lg:text-xl max-w-3xl mx-auto">
              Get intelligent insights about your business growth, analytics data,
              and performance metrics. Ask me anything about your data or try one of
              these suggestions!
            </p>

            {/* Feature Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition-all duration-200">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-black text-lg mb-2">
                  Traffic Analysis
                </h3>
                <p className="text-sm text-gray-600">
                  Get insights about website traffic and user behavior
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition-all duration-200">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-black text-lg mb-2">
                  Growth Metrics
                </h3>
                <p className="text-sm text-gray-600">
                  Analyze performance trends and key indicators
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition-all duration-200">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-black text-lg mb-2">
                  Business Intelligence
                </h3>
                <p className="text-sm text-gray-600">
                  Strategic insights and recommendations
                </p>
              </div>
            </div>

            {/* Interactive Suggestion Cards */}
            <div className="max-w-5xl mx-auto">
              <h3 className="text-xl font-semibold text-black mb-6">
                Try these questions to get started:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.title)}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 hover:border-gray-300 hover:swo-shadow-md transition-all duration-200 cursor-pointer group text-left"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gray-100 group-hover:bg-black rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                        <svg
                          className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={suggestion.icon}
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-black group-hover:text-gray-900 mb-2 leading-snug">
                          {suggestion.title}
                        </p>
                        <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                          {suggestion.description}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-none">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
