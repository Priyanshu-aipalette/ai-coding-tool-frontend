import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  FormControlLabel,
  Switch
} from '@mui/material'
import { useChatContext } from '../context/ChatContext'
import { sendPrompt, testStreamingConnection } from '../services/api'

const SendPromptExample = () => {
  const [prompt, setPrompt] = useState('')
  const [useContext, setUseContext] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState(null)
  
  const {
    sendPromptWithStreaming,
    messages,
    currentResponse,
    generatedCode,
    isStreaming,
    isLoading,
    error,
    isSidebarOpen
  } = useChatContext()

  // Test streaming connection
  const handleTestConnection = async () => {
    setConnectionStatus('testing')
    try {
      const isConnected = await testStreamingConnection()
      setConnectionStatus(isConnected ? 'success' : 'failed')
    } catch (error) {
      setConnectionStatus('failed')
    }
  }

  // Send prompt using context (recommended approach)
  const handleSendWithContext = async () => {
    if (!prompt.trim()) return
    
    try {
      await sendPromptWithStreaming(prompt, useContext)
      setPrompt('')
    } catch (error) {
      console.error('Error sending prompt:', error)
    }
  }

  // Send prompt directly using API (advanced usage)
  const handleSendDirectly = async () => {
    if (!prompt.trim()) return
    
    try {
      const messageHistory = messages.filter(msg => msg.content.trim() !== '')
      
      const context = {
        appendCurrentResponse: (chunk) => {
          console.log('Received chunk:', chunk)
        },
        clearCurrentResponse: () => {
          console.log('Clearing current response')
        },
        addMessage: (message) => {
          console.log('Adding message:', message)
        },
        setGeneratedCode: (code) => {
          console.log('Generated code detected:', code)
        },
        setSidebarOpen: (isOpen) => {
          console.log('Setting sidebar open:', isOpen)
        }
      }
      
      await sendPrompt(prompt, messageHistory, context)
      setPrompt('')
    } catch (error) {
      console.error('Error sending prompt directly:', error)
    }
  }

  const examplePrompts = [
    "Create a React component for a todo list",
    "Write a Python function to calculate Fibonacci numbers",
    "Generate HTML for a responsive contact form",
    "Create a JavaScript function to validate email addresses",
    "Write CSS for a modern card layout"
  ]

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        SendPrompt API Example
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        This example demonstrates how to use the new `sendPrompt` function that streams responses
        from the FastAPI `/stream` endpoint and automatically detects generated code blocks.
      </Typography>

      {/* Connection Test */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Connection Test
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleTestConnection}
            disabled={connectionStatus === 'testing'}
          >
            {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </Button>
          
          {connectionStatus === 'testing' && <CircularProgress size={20} />}
          {connectionStatus === 'success' && (
            <Chip label="Connected" color="success" size="small" />
          )}
          {connectionStatus === 'failed' && (
            <Chip label="Connection Failed" color="error" size="small" />
          )}
        </Box>
      </Paper>

      {/* Prompt Input */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Send Prompt
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Create a React component for a todo list with drag and drop functionality"
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={useContext}
                onChange={(e) => setUseContext(e.target.checked)}
              />
            }
            label="Include message history"
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSendWithContext}
            disabled={!prompt.trim() || isLoading || isStreaming}
            startIcon={isStreaming ? <CircularProgress size={16} /> : null}
          >
            {isStreaming ? 'Streaming...' : 'Send with Context'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={handleSendDirectly}
            disabled={!prompt.trim() || isLoading || isStreaming}
          >
            Send Directly
          </Button>
        </Box>
      </Paper>

      {/* Example Prompts */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Example Prompts
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {examplePrompts.map((example, index) => (
            <Chip
              key={index}
              label={example}
              onClick={() => setPrompt(example)}
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Paper>

      {/* Status Display */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Status
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip 
            label={`Messages: ${messages.length}`} 
            color={messages.length > 0 ? 'primary' : 'default'}
            size="small"
          />
          <Chip 
            label={`Streaming: ${isStreaming ? 'Yes' : 'No'}`} 
            color={isStreaming ? 'success' : 'default'}
            size="small"
          />
          <Chip 
            label={`Loading: ${isLoading ? 'Yes' : 'No'}`} 
            color={isLoading ? 'warning' : 'default'}
            size="small"
          />
          <Chip 
            label={`Sidebar: ${isSidebarOpen ? 'Open' : 'Closed'}`} 
            color={isSidebarOpen ? 'info' : 'default'}
            size="small"
          />
          <Chip 
            label={`Generated Code: ${generatedCode ? 'Yes' : 'No'}`} 
            color={generatedCode ? 'success' : 'default'}
            size="small"
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {currentResponse && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Current Response:
            </Typography>
            <Paper sx={{ p: 1, bgcolor: 'grey.50', fontFamily: 'monospace' }}>
              {currentResponse}
            </Paper>
          </Box>
        )}

        {generatedCode && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Generated Code:
            </Typography>
            <Paper sx={{ p: 1, bgcolor: 'grey.50', fontFamily: 'monospace' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {generatedCode}
              </pre>
            </Paper>
          </Box>
        )}
      </Paper>

      {/* API Documentation */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          API Usage
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom>
          Using ChatContext (Recommended):
        </Typography>
        <Paper sx={{ p: 1, bgcolor: 'grey.50', mb: 2 }}>
          <pre style={{ margin: 0, fontSize: '0.875rem' }}>
{`// In your component
const { sendPromptWithStreaming } = useChatContext()

// Send prompt with automatic code detection
await sendPromptWithStreaming(prompt, useMessageHistory)
`}
          </pre>
        </Paper>

        <Typography variant="subtitle2" gutterBottom>
          Direct API Usage (Advanced):
        </Typography>
        <Paper sx={{ p: 1, bgcolor: 'grey.50' }}>
          <pre style={{ margin: 0, fontSize: '0.875rem' }}>
{`// Import the function
import { sendPrompt } from '../services/api'

// Create context object
const context = {
  appendCurrentResponse: (chunk) => { /* handle chunk */ },
  clearCurrentResponse: () => { /* clear response */ },
  addMessage: (message) => { /* add message */ },
  setGeneratedCode: (code) => { /* handle code */ },
  setSidebarOpen: (isOpen) => { /* toggle sidebar */ }
}

// Send prompt
await sendPrompt(prompt, messageHistory, context)
`}
          </pre>
        </Paper>
      </Paper>
    </Box>
  )
}

export default SendPromptExample 