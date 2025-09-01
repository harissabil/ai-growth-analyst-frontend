# AI Growth Analyst Frontend

A modern Next.js 15 application with TypeScript and App Router for AI-powered growth analysis conversations.

## Features

- **Multi-turn Chat Interface**: Interactive chat with AI growth analyst
- **Local Storage**: Conversation history persisted in browser localStorage
- **Server-side API Proxy**: Secure API key handling on server
- **Responsive Design**: Built with Tailwind CSS
- **History Management**: View and browse past conversations
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **localStorage** for client-side persistence
- **Repository Pattern** for easy database migration later

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx               # Redirects to /chat
│   ├── chat/page.tsx          # Main chat interface
│   ├── history/page.tsx       # Chat history viewer
│   └── api/chat/route.ts      # Server-side API proxy
├── components/
│   ├── ChatMessage.tsx        # Message bubble component
│   ├── ChatInput.tsx          # Text input with send button
│   ├── ChatThread.tsx         # Message list with auto-scroll
│   └── ErrorBanner.tsx        # Error display component
└── lib/
    ├── api-client.ts          # Server-side API client
    ├── types.ts               # TypeScript type definitions
    └── store/
        └── chat-repo.ts       # localStorage repository
```

## Environment Setup

Create a `.env.local` file in the project root:

```env
UPSTREAM_API_BASE=https://ai-growth-analyst-agent-dyfadachcsctf2fk.southeastasia-01.azurewebsites.net
UPSTREAM_API_KEY=your_actual_api_key_here
NODE_ENV=development
```

**Important**: Replace `your_actual_api_key_here` with your actual API key.

## Installation & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.local` and update `UPSTREAM_API_KEY` with your actual API key

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The application uses a server-side proxy pattern to securely communicate with the AI backend:

- **Client** → `/api/chat` → **Upstream AI Service**
- API keys are kept secure on the server side
- Error handling for 401 (unauthorized) and network issues
- Request/response format matches upstream API specification

## Usage

1. **Start a Chat**: Navigate to `/chat` or use the home page redirect
2. **Send Messages**: Type in the input field and press Enter (Shift+Enter for new lines)
3. **View History**: Visit `/history` to see past conversations
4. **View Past Chats**: Click on any history item to open a read-only modal

## Error Handling

- **401 Unauthorized**: Check server environment API key configuration
- **Network Errors**: Displayed with retry suggestions
- **Invalid Responses**: Graceful fallback with error messages

## Development Notes

- Repository pattern in `chat-repo.ts` makes it easy to swap localStorage for a database later
- Type-safe API client with proper error handling
- Responsive design optimized for both desktop and mobile
- Auto-scroll behavior in chat thread for better UX

## Future Enhancements

- Replace localStorage with persistent database
- Add user authentication
- Implement conversation sharing
- Add export functionality for chat history
- Stream responses for real-time chat experience
