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
    <div className="flex gap-2 p-4 border-t bg-white">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
        disabled={isLoading}
        rows={1}
        className="
          flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          min-h-[40px] max-h-[120px]
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
          px-4 py-2 bg-blue-500 text-white rounded-lg
          hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
          transition-colors min-w-[80px]
        "
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
