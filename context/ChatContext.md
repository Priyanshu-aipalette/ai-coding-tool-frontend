# ChatContext Implementation

A comprehensive React Context API implementation for managing chat state, streaming responses, generated code, and UI state in the AI Coding Agent application.

## Overview

The ChatContext provides a centralized state management solution using React's Context API and useReducer hook. It manages all chat-related state and provides methods to interact with the chat functionality.

## State Properties

### Core State
- **`messages`**: `array` - Array of chat message objects
- **`currentResponse`**: `string` - Current streaming response text
- **`generatedCode`**: `string` - Generated code content
- **`isSidebarOpen`**: `boolean` - Sidebar visibility state

### Session State
- **`currentSessionId`**: `string | null` - Current chat session ID
- **`sessionInfo`**: `object | null` - Session metadata

### UI State
- **`isLoading`**: `boolean` - Loading state for API calls
- **`isStreaming`**: `boolean` - Streaming state for real-time responses
- **`error`**: `string | null` - Error message for user feedback

## Available Methods

### Core Methods
- **`toggleSidebar()`**: Toggle sidebar visibility
- **`setGeneratedCode(code: string)`**: Set generated code content

### Message Management
- **`sendMessage(message: string, streaming?: boolean)`**: Send a message with optional streaming
- **`addMessage(message: object)`**: Add a single message to the chat
- **`clearSession()`**: Clear current session and all messages

### Streaming Controls
- **`setCurrentResponse(response: string)`**: Set current streaming response
- **`appendCurrentResponse(chunk: string)`**: Append text to current response
- **`clearCurrentResponse()`**: Clear current streaming response

### Session Management
- **`createSession()`**: Create a new chat session
- **`loadMessages(sessionId: string)`**: Load messages from a session

### Error Handling
- **`clearError()`**: Clear current error state

## Usage

### Basic Setup

```jsx
import React from 'react'
import { ChatProvider, useChatContext } from './context/ChatContext'

function App() {
  return (
    <ChatProvider>
      <YourComponent />
    </ChatProvider>
  )
}

function YourComponent() {
  const {
    messages,
    currentResponse,
    generatedCode,
    isSidebarOpen,
    toggleSidebar,
    setGeneratedCode,
    sendMessage
  } = useChatContext()

  // Your component logic here
}
```

### Message Format

Messages follow this structure:

```jsx
{
  role: 'user' | 'assistant' | 'system',
  content: string,
  timestamp: string, // ISO date string
  metadata?: object  // Optional metadata
}
```

### Streaming Implementation

The context handles streaming responses automatically:

```jsx
// Streaming is enabled by default
await sendMessage("Hello AI!")

// During streaming, currentResponse updates in real-time
// The last message in the messages array also updates
```

### Error Handling

```jsx
const { error, clearError } = useChatContext()

if (error) {
  return (
    <Alert severity="error" onClose={clearError}>
      {error}
    </Alert>
  )
}
```

## Implementation Details

### Reducer Pattern

The context uses a reducer pattern for state management:

```jsx
const actionTypes = {
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_CURRENT_RESPONSE: 'SET_CURRENT_RESPONSE',
  APPEND_CURRENT_RESPONSE: 'APPEND_CURRENT_RESPONSE',
  CLEAR_CURRENT_RESPONSE: 'CLEAR_CURRENT_RESPONSE',
  SET_GENERATED_CODE: 'SET_GENERATED_CODE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  // ... more actions
}
```

### Backend Integration

The context integrates with the chat service:

```jsx
// Uses existing chatService for API calls
import { chatService } from '../services/chatService'

// Streaming support
await chatService.sendMessageStream(
  message,
  sessionId,
  onChunk,
  onError,
  onComplete
)
```

### Memory Management

- Messages are limited to 50 per session
- Sessions auto-expire after 24 hours
- Current response is cleared after streaming completes

## Advanced Features

### Dual Response Tracking

The context tracks responses in two ways:
1. **`currentResponse`** - Real-time streaming text
2. **Last message in `messages`** - Persistent message history

This allows for:
- Real-time UI updates during streaming
- Persistent chat history
- Better user experience

### Session Management

```jsx
// Create new session
const sessionId = await createSession()

// Load existing session
await loadMessages(sessionId)

// Clear current session
clearSession()
```

### Code Generation

```jsx
// Set generated code
setGeneratedCode(`
function hello() {
  console.log("Hello World!")
}
`)

// Access generated code
const { generatedCode } = useChatContext()
```

## Best Practices

### 1. Error Boundaries

Wrap your app with error boundaries:

```jsx
<ErrorBoundary>
  <ChatProvider>
    <App />
  </ChatProvider>
</ErrorBoundary>
```

### 2. Loading States

Always handle loading states:

```jsx
const { isLoading, isStreaming } = useChatContext()

if (isLoading) {
  return <CircularProgress />
}
```

### 3. Conditional Rendering

```jsx
const { messages, currentResponse, isSidebarOpen } = useChatContext()

return (
  <Box sx={{ display: 'flex' }}>
    {isSidebarOpen && <Sidebar />}
    <ChatArea />
  </Box>
)
```

### 4. Cleanup

The context handles cleanup automatically:
- Clears streaming state on completion
- Manages session timeouts
- Handles component unmounting

## Testing

### Mock Context

```jsx
const mockContextValue = {
  messages: [],
  currentResponse: '',
  generatedCode: '',
  isSidebarOpen: false,
  toggleSidebar: jest.fn(),
  setGeneratedCode: jest.fn(),
  sendMessage: jest.fn(),
}

<ChatContext.Provider value={mockContextValue}>
  <ComponentToTest />
</ChatContext.Provider>
```

### Test Streaming

```jsx
// Test streaming functionality
const { appendCurrentResponse } = useChatContext()

// Simulate streaming
'Hello World'.split('').forEach((char, index) => {
  setTimeout(() => appendCurrentResponse(char), index * 100)
})
```

## Migration Guide

### From Old Context

If migrating from an older context implementation:

1. **Update imports**:
   ```jsx
   // Old
   import { useChat } from './context/ChatContext'
   
   // New
   import { useChatContext } from './context/ChatContext'
   ```

2. **Update hook usage**:
   ```jsx
   // Old
   const { messages, sendMessage } = useChat()
   
   // New
   const { messages, sendMessage } = useChatContext()
   ```

3. **Add new properties**:
   ```jsx
   const {
     messages,
     currentResponse,      // New
     generatedCode,        // New
     isSidebarOpen,        // New
     toggleSidebar,        // New
     setGeneratedCode      // New
   } = useChatContext()
   ```

## Performance Considerations

- **Reducer optimization**: Actions are structured for minimal re-renders
- **Memory limits**: Messages are capped at 50 per session
- **Streaming efficiency**: Chunks are processed in batches
- **Session cleanup**: Automatic cleanup prevents memory leaks

## Compatibility

- **React 16.8+**: Uses hooks and context
- **Material UI 5+**: Compatible with MUI components
- **Modern browsers**: Supports streaming APIs
- **TypeScript**: Full type support available

## License

This implementation is part of the AI Coding Agent project and is available under the MIT License. 