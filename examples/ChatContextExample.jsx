import React from 'react'
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Stack,
  Chip,
  Alert
} from '@mui/material'
import { useChatContext } from '../context/ChatContext'

/**
 * Example component demonstrating how to use the ChatContext
 * with all the new properties and methods
 */
const ChatContextExample = () => {
  const {
    // State properties
    messages,
    currentResponse,
    generatedCode,
    isSidebarOpen,
    isLoading,
    isStreaming,
    error,
    currentSessionId,
    
    // Action methods
    toggleSidebar,
    setGeneratedCode,
    sendMessage,
    clearSession,
    addMessage,
    setCurrentResponse,
    appendCurrentResponse,
    clearCurrentResponse
  } = useChatContext()

  const [inputMessage, setInputMessage] = React.useState('')
  const [codeInput, setCodeInput] = React.useState('')

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim())
      setInputMessage('')
    }
  }

  const handleAddTestMessage = () => {
    addMessage({
      role: 'user',
      content: 'This is a test message added manually',
      timestamp: new Date().toISOString()
    })
  }

  const handleSetGeneratedCode = () => {
    setGeneratedCode(codeInput)
  }

  const handleTestStreaming = () => {
    setCurrentResponse('')
    const testText = "This is a test streaming response..."
    
    testText.split('').forEach((char, index) => {
      setTimeout(() => {
        appendCurrentResponse(char)
      }, index * 50)
    })
  }

  const handleClearStreaming = () => {
    clearCurrentResponse()
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ChatContext Example
      </Typography>
      
      <Typography variant="body1" paragraph>
        This example demonstrates all the ChatContext properties and methods.
      </Typography>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* State Display */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current State
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip 
            label={`Messages: ${messages.length}`} 
            color="primary" 
            size="small" 
          />
          <Chip 
            label={`Sidebar: ${isSidebarOpen ? 'Open' : 'Closed'}`} 
            color="secondary" 
            size="small" 
          />
          <Chip 
            label={`Loading: ${isLoading ? 'Yes' : 'No'}`} 
            color={isLoading ? 'warning' : 'default'} 
            size="small" 
          />
          <Chip 
            label={`Streaming: ${isStreaming ? 'Yes' : 'No'}`} 
            color={isStreaming ? 'success' : 'default'} 
            size="small" 
          />
        </Stack>

        {currentSessionId && (
          <Typography variant="body2" color="text.secondary">
            Session ID: {currentSessionId}
          </Typography>
        )}
      </Paper>

      {/* Controls */}
      <Stack spacing={3}>
        {/* Message Controls */}
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Message Controls
          </Typography>
          
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                variant="contained" 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                Send
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                onClick={handleAddTestMessage}
                size="small"
              >
                Add Test Message
              </Button>
              <Button 
                variant="outlined" 
                onClick={clearSession}
                size="small"
                color="error"
              >
                Clear Session
              </Button>
            </Box>
          </Stack>
        </Paper>

        {/* Streaming Controls */}
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Streaming Controls
          </Typography>
          
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                onClick={handleTestStreaming}
                size="small"
              >
                Test Streaming
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleClearStreaming}
                size="small"
                color="error"
              >
                Clear Stream
              </Button>
            </Box>
            
            {currentResponse && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 1, 
                  bgcolor: 'grey.100', 
                  border: '1px solid',
                  borderColor: 'grey.300'
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Current Response:
                </Typography>
                <Typography variant="body2">
                  {currentResponse}
                </Typography>
              </Paper>
            )}
          </Stack>
        </Paper>

        {/* Code Generation Controls */}
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Code Generation Controls
          </Typography>
          
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Generated Code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                multiline
                rows={3}
              />
              <Button 
                variant="contained" 
                onClick={handleSetGeneratedCode}
                disabled={!codeInput.trim()}
              >
                Set Code
              </Button>
            </Box>
            
            {generatedCode && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 1, 
                  bgcolor: 'grey.900', 
                  color: 'white',
                  fontFamily: 'monospace'
                }}
              >
                <Typography variant="caption" color="grey.400">
                  Generated Code:
                </Typography>
                <Typography variant="body2" component="pre">
                  {generatedCode}
                </Typography>
              </Paper>
            )}
          </Stack>
        </Paper>

        {/* Sidebar Controls */}
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Sidebar Controls
          </Typography>
          
          <Button 
            variant="outlined" 
            onClick={toggleSidebar}
            size="small"
          >
            Toggle Sidebar ({isSidebarOpen ? 'Close' : 'Open'})
          </Button>
        </Paper>

        {/* Messages Display */}
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Messages ({messages.length})
          </Typography>
          
          <List sx={{ maxHeight: 200, overflow: 'auto' }}>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={message.role} 
                          size="small" 
                          color={message.role === 'user' ? 'primary' : 'secondary'}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    }
                    secondary={message.content}
                  />
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {messages.length === 0 && (
              <ListItem>
                <ListItemText 
                  primary="No messages yet" 
                  secondary="Send a message to see it appear here"
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Stack>
    </Box>
  )
}

export default ChatContextExample

/**
 * Usage Instructions:
 * 
 * 1. Wrap your app with ChatProvider:
 *    import { ChatProvider } from './context/ChatContext'
 *    
 *    function App() {
 *      return (
 *        <ChatProvider>
 *          <ChatContextExample />
 *        </ChatProvider>
 *      )
 *    }
 * 
 * 2. Use the useChatContext hook:
 *    const {
 *      messages,
 *      currentResponse,
 *      generatedCode,
 *      isSidebarOpen,
 *      toggleSidebar,
 *      setGeneratedCode
 *    } = useChatContext()
 * 
 * 3. Available properties:
 *    - messages: array of chat objects
 *    - currentResponse: streaming text
 *    - generatedCode: string
 *    - isSidebarOpen: boolean
 *    - isLoading: boolean
 *    - isStreaming: boolean
 *    - error: string | null
 *    - currentSessionId: string | null
 * 
 * 4. Available methods:
 *    - toggleSidebar(): void
 *    - setGeneratedCode(code: string): void
 *    - sendMessage(message: string, streaming?: boolean): Promise<void>
 *    - clearSession(): void
 *    - addMessage(message: object): void
 *    - setCurrentResponse(response: string): void
 *    - appendCurrentResponse(chunk: string): void
 *    - clearCurrentResponse(): void
 */ 