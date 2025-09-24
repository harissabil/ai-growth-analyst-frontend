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
    chat_history_id: string;
    messages: { role: string; content: string; tables?: Table[] | null }[];
};

export type ChatHistory = {
    chat_history_id: string;
    title: string;
    created_at: string;
    updated_at: string;
    message_count: number;
};

export type ApiError = {
    code: number;
    message: string;
};
