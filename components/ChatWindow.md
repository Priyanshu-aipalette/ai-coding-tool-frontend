# ChatWindow Component

A comprehensive React component that provides a complete chat interface with real-time streaming responses, code highlighting, and Material UI design. Perfect for building AI-powered coding assistants like Claude.

## Features

- ✅ **Real-time Streaming**: Live token-by-token responses from AI
- ✅ **Code Highlighting**: Automatic syntax highlighting with copy functionality
- ✅ **Session Management**: Persistent chat sessions with automatic cleanup
- ✅ **Material UI Design**: Modern, responsive interface
- ✅ **Context API Integration**: Uses React Context for state management
- ✅ **Error Handling**: Comprehensive error handling and user feedback
- ✅ **Auto-scroll**: Automatic scrolling to latest messages
- ✅ **Copy Functionality**: One-click copying of messages and code blocks

## Installation

```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install axios
```

## Basic Usage

```jsx
import React from 'react'
import { ChatProvider } from './context/ChatContext'
import ChatWindow from './components/ChatWindow'

function App() {
  return (
    <ChatProvider>
      <ChatWindow 
        height="600px" 
        showWelcome={true} 
      />
    </ChatProvider>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | `string` | `'600px'` | Height of the chat window |
| `showWelcome` | `boolean` | `true` | Whether to show welcome message when no messages |

## Context Requirements

The ChatWindow component requires the `ChatProvider` context to be available. It uses the following context values:

- `messages` - Array of chat messages
- `sendMessage` - Function to send messages
- `isLoading` - Loading state
- `isStreaming` - Streaming state
- `error` - Error messages
- `clearError` - Function to clear errors
- `currentSessionId` - Current session ID

## Message Format

Messages should follow this structure:

```jsx
{
  role: 'user' | 'assistant' | 'system',
  content: string,
  timestamp: string, // ISO date string
  metadata?: object  // Optional metadata
}
```

## Streaming Implementation

The component uses the existing chat service with streaming support:

```jsx
// In ChatContext
const sendMessage = async (message, useStreaming = true) => {
  // Add user message immediately
  const userMessage = {
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  }
  dispatch({ type: 'ADD_MESSAGE', payload: userMessage })

  if (useStreaming) {
    // Add empty assistant message for streaming
    const assistantMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    }
    dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage })

    // Stream response using Fetch API and ReadableStream
    await chatService.sendMessageStream(
      message,
      sessionId,
      (chunk) => {
        dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: chunk })
      },
      (error) => {
        dispatch({ type: 'SET_ERROR', payload: error.message })
      },
      () => {
        dispatch({ type: 'SET_STREAMING', payload: false })
      }
    )
  }
}
```

## Backend Integration

The component expects a backend with these endpoints:

- `POST /api/v1/chat/stream` - Streaming chat endpoint
- `POST /api/v1/sessions` - Create new session
- `GET /api/v1/sessions/{id}/messages` - Get session messages

### Streaming Endpoint

The streaming endpoint should return Server-Sent Events (SSE):

```python
@app.post("/api/v1/chat/stream")
async def chat_stream(request: ChatRequest):
    async def generate_stream():
        async for chunk in ai_service.generate_streaming_response(request.message):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream"
    )
```

## Code Highlighting

The component automatically detects and highlights code blocks in markdown format:

```
```python
def hello_world():
    print("Hello, World!")
```
```

Features:
- Language detection from markdown code blocks
- Copy to clipboard functionality
- Dark theme for better readability
- Proper formatting and indentation

## Customization

### Styling

The component uses Material UI's sx prop for styling. You can customize colors and layout:

```jsx
<ChatWindow 
  height="800px"
  sx={{
    '& .MuiPaper-root': {
      backgroundColor: 'custom.background'
    }
  }}
/>
```

### Theme Integration

Works with Material UI themes:

```jsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

<ThemeProvider theme={theme}>
  <ChatWindow />
</ThemeProvider>
```

## Advanced Usage

### With Custom Header

```jsx
<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6">My AI Assistant</Typography>
    </Toolbar>
  </AppBar>
  <ChatWindow height="100%" />
</Box>
```

### Multiple Chat Windows

```jsx
<Grid container spacing={2}>
  <Grid item xs={12}>
    <ChatWindow height="500px" />
  </Grid>
</Grid>
```

## Event Handling

The component handles various events:

- **Enter Key**: Send message
- **Shift + Enter**: New line
- **Copy Actions**: Copy messages and code blocks
- **Auto-scroll**: Scroll to latest message
- **Error Handling**: Display error messages

## Performance Considerations

- Messages are limited to 50 per session to manage memory
- Auto-scroll is debounced for smooth performance
- Code highlighting is optimized for common languages
- Streaming chunks are processed efficiently

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast support
- Focus management

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

1. **Streaming not working**: Check backend streaming endpoint
2. **Context errors**: Ensure ChatProvider is wrapping the component
3. **Styling issues**: Verify Material UI theme is properly configured
4. **Copy functionality**: Requires HTTPS in production

### Debug Mode

Enable debug logging:

```jsx
const ChatWindow = ({ debug = false, ...props }) => {
  useEffect(() => {
    if (debug) {
      console.log('ChatWindow props:', props)
      console.log('Chat context:', { messages, isStreaming, error })
    }
  }, [debug, props, messages, isStreaming, error])
  
  // ... rest of component
}
```

## API Reference

### Component Methods

The component exposes these methods via ref:

```jsx
const chatRef = useRef()

<ChatWindow ref={chatRef} />

// Methods
chatRef.current.scrollToBottom()
chatRef.current.focusInput()
chatRef.current.clearMessages()
```

### Context API

```jsx
const {
  messages,           // Array of messages
  sendMessage,        // (message: string, streaming?: boolean) => Promise
  isLoading,          // boolean
  isStreaming,        // boolean
  error,             // string | null
  clearError,        // () => void
  currentSessionId,  // string | null
  createSession,     // () => Promise<string>
  clearSession      // () => void
} = useChat()
```

## License

This component is part of the AI Coding Agent project and is available under the MIT License. 