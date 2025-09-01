import { ChatTurn, Message } from '../types';

const STORAGE_KEY = 'ai_chat_turns_v1';

export const ChatRepo = {
  loadAll(): ChatTurn[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const data = JSON.parse(stored);
      if (!Array.isArray(data)) return [];

      return data.filter(turn =>
        turn &&
        typeof turn.id === 'string' &&
        Array.isArray(turn.messages) &&
        typeof turn.createdAt === 'number'
      );
    } catch (error) {
      console.warn('Failed to load chat turns from localStorage:', error);
      return [];
    }
  },

  saveTurn(turn: ChatTurn): void {
    if (typeof window === 'undefined') return;

    try {
      const turns = this.loadAll();
      const existingIndex = turns.findIndex(t => t.id === turn.id);

      if (existingIndex >= 0) {
        turns[existingIndex] = turn;
      } else {
        turns.push(turn);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(turns));
    } catch (error) {
      console.warn('Failed to save chat turn to localStorage:', error);
    }
  },

  newTurnFromThread(messages: Message[]): ChatTurn {
    return {
      id: `turn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      messages: [...messages],
      createdAt: Date.now(),
    };
  }
};
