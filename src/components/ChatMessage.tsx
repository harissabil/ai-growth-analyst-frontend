import { Message } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import DataTable from './DataTable';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isThinking = isAssistant && message.content === 'Thinking...';
  const hasTables = message.tables && message.tables.length > 0;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-8 group`}>
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mr-4 mt-1 swo-shadow-md flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <div className={`max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
        {/* Tables (only show for assistant messages with tables) */}
        {hasTables && isAssistant && !isThinking && (
          <DataTable tables={message.tables!} />
        )}

        {/* Message bubble */}
        <div
          className={`
            px-6 py-4 rounded-2xl break-words transition-all duration-200 group-hover:swo-shadow-md
            ${isUser 
              ? 'swo-gradient text-white rounded-br-lg swo-shadow' 
              : 'bg-gray-50 text-gray-900 border border-gray-200 rounded-bl-lg swo-shadow'
            }
          `}
        >
          {isThinking ? (
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-gray-600 text-sm font-medium">AI is analyzing your request...</span>
            </div>
          ) : isAssistant ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-gray-800">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-800">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-gray-800">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-800">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>,
                  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                  code: ({ children }) => (
                    <code className="bg-white px-2 py-1 rounded-md text-sm font-mono text-black border border-gray-200 swo-shadow">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-white p-4 rounded-lg overflow-x-auto border border-gray-200 text-sm font-mono my-3 swo-shadow">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-400 pl-4 py-2 my-3 bg-gray-100 rounded-r-lg">
                      <div className="text-gray-700">{children}</div>
                    </blockquote>
                  ),
                  h1: ({ children }) => <h1 className="text-xl font-bold text-black mb-3 mt-4 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-semibold text-black mb-2 mt-3 first:mt-0">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-medium text-black mb-2 mt-3 first:mt-0">{children}</h3>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-white leading-relaxed font-medium">{message.content}</div>
          )}
        </div>
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center ml-4 mt-1 swo-shadow-md flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
