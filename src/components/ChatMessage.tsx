import { Message } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isThinking = isAssistant && message.content === 'Thinking...';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mr-3 mt-1 shadow-md">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      )}

      <div
        className={`
          max-w-[75%] px-5 py-3 rounded-2xl break-words shadow-sm transition-all duration-200 group-hover:shadow-md
          ${isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto rounded-br-md' 
            : 'bg-white text-gray-800 mr-auto border border-gray-100 rounded-bl-md'
          }
        `}
      >
        {isThinking ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-gray-500 text-sm">AI is analyzing...</span>
          </div>
        ) : isAssistant ? (
          <div className="prose prose-sm max-w-none prose-gray">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-gray-700">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-gray-700">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded-md text-sm font-mono text-blue-600 border">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto border text-sm font-mono my-3">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-200 pl-4 py-2 my-3 bg-blue-50/50 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                h1: ({ children }) => <h1 className="text-xl font-bold text-gray-900 mb-3 mt-4 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold text-gray-800 mb-2 mt-3 first:mt-0">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-medium text-gray-800 mb-2 mt-3 first:mt-0">{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-white leading-relaxed">{message.content}</div>
        )}
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ml-3 mt-1 shadow-md">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
