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
    <div className={`mb-6 sm:mb-8 ${isUser ? 'flex justify-end' : ''}`}>
      {isUser ? (
        // User message - bubble style with proper line break handling
        <div className="max-w-[90%] sm:max-w-[85%]">
          <div className="swo-gradient text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl rounded-br-lg swo-shadow">
            <div className="text-white leading-relaxed font-medium whitespace-pre-wrap text-sm sm:text-base">
              {message.content}
            </div>
          </div>
        </div>
      ) : (
        // Assistant message - no bubble, full width
        <div className="w-full">
          {/* Tables (only show for assistant messages with tables) */}
          {hasTables && !isThinking && (
            <div className="mb-4 sm:mb-6">
              <DataTable tables={message.tables!} />
            </div>
          )}

          {/* Assistant message content */}
          {isThinking ? (
            <div className="flex items-center space-x-2 sm:space-x-3 py-3 sm:py-4">
              <div className="flex space-x-1">
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
              <span className="text-gray-600 text-xs sm:text-sm font-medium">
                AI is analyzing your request...
              </span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none py-3 sm:py-4">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-2 sm:mb-3 last:mb-0 leading-relaxed text-gray-800 text-sm sm:text-base">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-4 sm:pl-5 mb-2 sm:mb-3 space-y-1 text-gray-800 text-sm sm:text-base">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-4 sm:pl-5 mb-2 sm:mb-3 space-y-1 text-gray-800 text-sm sm:text-base">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-800 text-sm sm:text-base">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-black">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-700">{children}</em>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-mono text-black border border-gray-200">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 p-3 sm:p-4 rounded-lg overflow-x-auto border border-gray-200 text-xs sm:text-sm font-mono my-2 sm:my-3">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-400 pl-3 sm:pl-4 py-2 my-2 sm:my-3 bg-gray-50 rounded-r-lg">
                      <div className="text-gray-700 text-sm sm:text-base">
                        {children}
                      </div>
                    </blockquote>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-lg sm:text-xl font-bold text-black mb-2 sm:mb-3 mt-3 sm:mt-4 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base sm:text-lg font-semibold text-black mb-2 mt-2 sm:mt-3 first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm sm:text-base font-medium text-black mb-1.5 sm:mb-2 mt-2 sm:mt-3 first:mt-0">
                      {children}
                    </h3>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
