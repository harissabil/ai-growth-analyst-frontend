import { useState, KeyboardEvent, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  suggestionText?: string;
}

export default function ChatInput({ onSend, isLoading, suggestionText }: ChatInputProps) {
  const [input, setInput] = useState('');

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

  return (
    <div className="p-6 bg-white border-t border-gray-200">
      <div className="flex gap-4 items-end bg-white rounded-xl swo-shadow-md border border-gray-200 p-4 transition-all duration-200 focus-within:swo-shadow-lg focus-within:border-gray-400">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your business growth, analytics, or any insights..."
          disabled={isLoading}
          rows={1}
          className="
            flex-1 resize-none border-0 bg-transparent px-3 py-3
            focus:outline-none placeholder-gray-500 text-gray-900
            min-h-[44px] max-h-[120px] leading-relaxed font-medium
          "
          style={{
            height: 'auto',
            minHeight: '44px',
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
            p-3 bg-black text-white rounded-lg
            hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500
            disabled:cursor-not-allowed transition-all duration-200 swo-shadow-md hover:swo-shadow-lg
            transform hover:scale-105 active:scale-95 min-w-[52px] flex items-center justify-center
            font-medium
          "
          title={isLoading ? "Sending..." : "Send message"}
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mt-4 px-2">
        <p className="text-xs text-gray-600 font-medium">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs border border-gray-200 font-mono">Enter</kbd> to send,
          <kbd className="px-2 py-1 bg-gray-100 rounded text-xs ml-1 border border-gray-200 font-mono">Shift + Enter</kbd> for new line
        </p>
        <div className="text-xs text-gray-500">
          {input.length > 0 && `${input.length} characters`}
        </div>
      </div>
    </div>
  );
}
