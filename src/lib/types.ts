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

// Google OAuth types
export interface GoogleOAuthToken {
    id: string;
    access_token: string;
    refresh_token: string;
    scope: string | string[];
    expiry_date: string;
    email: string;
    name: string;
    image_url: string;
}

export interface GoogleOAuthResponse {
    message: string;
    data: GoogleOAuthToken | null;
}

// Platform configuration types
export interface GoogleAnalytics {
    connected: boolean;
    current: {
        property_id: string;
        property_name: string;
    };
    options: Array<{
        property_id: string;
        property_name: string;
    }>;
}

export interface GoogleSearchConsole {
    connected: boolean;
    current: {
        property_type: string;
        property_name: string;
    } | null;
    options: Array<{
        property_type: string;
        property_name: string;
    }>;
}

export interface GoogleAds {
    connected: boolean;
    current: {
        manager_account_developer_token: string;
        customer_account_id: string;
    };
    options: string[];
}

export interface PlatformData {
    google_analytics: GoogleAnalytics;
    google_search_console: GoogleSearchConsole;
    google_ads: GoogleAds;
}

export interface PlatformResponse {
    message: string;
    data: PlatformData;
}

export interface PlatformUpdateRequest {
    google_analytics?: {
        property_id: string;
    };
    google_search_console?: {
        property_type: string;
        property_name: string;
    };
    google_ads?: {
        manager_account_developer_token?: string;
        customer_account_id?: string;
    };
}
