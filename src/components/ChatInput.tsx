import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed && !isLoading) {
      onSend(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 bg-white/70 backdrop-blur-sm border-t border-gray-200/50">
      <div className="flex gap-3 items-end bg-white rounded-2xl shadow-lg border border-gray-200/50 p-3 transition-all duration-200 focus-within:shadow-xl focus-within:border-blue-300">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your business growth, analytics, or any insights..."
          disabled={isLoading}
          rows={1}
          className="
            flex-1 resize-none border-0 bg-transparent px-2 py-2
            focus:outline-none placeholder-gray-400 text-gray-700
            min-h-[40px] max-h-[120px] leading-relaxed
          "
          style={{
            height: 'auto',
            minHeight: '40px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="
            p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl
            hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400
            disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg
            transform hover:scale-105 active:scale-95 min-w-[48px] flex items-center justify-center
          "
          title={isLoading ? "Sending..." : "Send message"}
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 px-2">
        <p className="text-xs text-gray-500">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to send,
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs ml-1">Shift + Enter</kbd> for new line
        </p>
        <div className="text-xs text-gray-400">
          {input.length > 0 && `${input.length} characters`}
        </div>
      </div>
    </div>
  );
}
