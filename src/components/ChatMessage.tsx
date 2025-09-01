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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-[70%] px-4 py-2 rounded-lg break-words
          ${isUser 
            ? 'bg-blue-500 text-white ml-auto' 
            : 'bg-gray-100 text-gray-900 mr-auto'
          }
        `}
      >
        {isThinking ? (
          <div className="flex items-center space-x-1">
            <span className="text-gray-600">AI is thinking</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : isAssistant ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                p: ({ children, ...props }) => <p className="mb-2 last:mb-0">{children}</p>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ul: ({ children, ...props }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ol: ({ children, ...props }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                li: ({ children, ...props }) => <li className="mb-1">{children}</li>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                strong: ({ children, ...props }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                em: ({ children, ...props }) => <em className="italic">{children}</em>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                code: ({ children, ...props }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                pre: ({ children, ...props }) => <pre className="bg-gray-200 p-2 rounded text-sm font-mono overflow-x-auto">{children}</pre>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h1: ({ children, ...props }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h2: ({ children, ...props }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                h3: ({ children, ...props }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  );
}
