export type Role = "user" | "assistant" | "system";

export type Message = {
  role: Role;
  content: string;
};

export type ApiResponse = {
  messages: { role: string; content: string }[];
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
