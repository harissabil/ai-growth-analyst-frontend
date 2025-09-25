import { useState, KeyboardEvent, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  suggestionText?: string;
}

export default function ChatInput({ onSend, isLoading, suggestionText }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fill input when suggestion is clicked
  useEffect(() => {
    if (suggestionText) {
      setInput(suggestionText);
      // Auto-focus the textarea
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
        // Move cursor to end
        textarea.setSelectionRange(suggestionText.length, suggestionText.length);
      }
    }
  }, [suggestionText]);

  const handleSubmit = () => {
    // Only trim leading/trailing whitespace, but preserve internal newlines
    const processed = input.replace(/^\s+|\s+$/g, '');
    if (processed && !isLoading) {
      onSend(processed);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Different placeholders for mobile and desktop
  const placeholderText = isMobile
    ? "Ask about your analytics..."
    : "Ask about your business growth, analytics, or any insights...";

  return (
    <div className="p-3 sm:p-6 bg-white border-t border-gray-200">
      <div className="flex gap-2 sm:gap-4 items-end bg-white rounded-xl swo-shadow-md border border-gray-200 p-3 sm:p-4 transition-all duration-200 focus-within:swo-shadow-lg focus-within:border-gray-400">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          disabled={isLoading}
          rows={1}
          className="
            flex-1 resize-none border-0 bg-transparent px-2 sm:px-3 py-2 sm:py-3
            focus:outline-none placeholder-gray-400 text-gray-900
            min-h-[40px] sm:min-h-[44px] max-h-[100px] sm:max-h-[120px]
            leading-relaxed font-medium text-sm sm:text-base
            placeholder:text-sm sm:placeholder:text-base
          "
          style={{
            height: 'auto',
            minHeight: isMobile ? '40px' : '44px',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            const maxHeight = isMobile ? 100 : 120;
            target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="
            p-2 sm:p-3 bg-black text-white rounded-lg
            hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500
            disabled:cursor-not-allowed transition-all duration-200 swo-shadow-md hover:swo-shadow-lg
            transform hover:scale-105 active:scale-95 min-w-[44px] sm:min-w-[52px]
            flex items-center justify-center font-medium flex-shrink-0
          "
          title={isLoading ? "Sending..." : "Send message"}
        >
          {isLoading ? (
            <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 sm:mt-4 px-1 sm:px-2 space-y-2 sm:space-y-0">
        <p className="text-xs text-gray-600 font-medium">
          Press <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded text-xs border border-gray-200 font-mono">Enter</kbd> to send,
          <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded text-xs ml-1 border border-gray-200 font-mono">Shift + Enter</kbd> for new line
        </p>
        <div className="text-xs text-gray-500 self-end sm:self-auto">
          {input.length > 0 && `${input.length} characters`}
        </div>
      </div>
    </div>
  );
}
