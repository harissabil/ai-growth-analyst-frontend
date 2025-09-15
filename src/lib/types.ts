export type Role = "user" | "assistant" | "system";

export type Table = {
  name: string;
  columns: string[];
  rows: (string | number)[][];
};

export type Message = {
  role: Role;
  content: string;
  tables?: Table[] | null;
};

export type ApiResponse = {
  messages: { role: string; content: string; tables?: Table[] | null }[];
};

export type ChatTurn = {
  id: string;
  messages: Message[];
  createdAt: number;
};

export type ApiError = {
  code: number;
  message: string;
};
