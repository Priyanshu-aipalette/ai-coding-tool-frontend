import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box } from '@mui/material'
import { ChatProvider } from '../context/ChatContext'
import ChatWindow from '../components/ChatWindow'

// Create a Material UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

/**
 * Standalone ChatWindow Example
 * 
 * This example shows how to use the ChatWindow component
 * with proper providers and theming.
 */
const ChatWindowExample = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatProvider>
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'primary.main', 
            color: 'primary.contrastText',
            textAlign: 'center'
          }}>
            <h1>My AI Coding Assistant</h1>
          </Box>
          
          {/* Chat Window */}
          <Box sx={{ flex: 1, display: 'flex' }}>
            <ChatWindow 
              height="100%" 
              showWelcome={true}
            />
          </Box>
        </Box>
      </ChatProvider>
    </ThemeProvider>
  )
}

export default ChatWindowExample

/**
 * Usage Instructions:
 * 
 * 1. Install dependencies:
 *    npm install @mui/material @emotion/react @emotion/styled
 *    npm install @mui/icons-material
 *    npm install axios
 * 
 * 2. Make sure your backend is running at http://localhost:8000
 * 
 * 3. Set up environment variables:
 *    - GEMINI_API_KEY in backend/.env
 * 
 * 4. Use the component:
 *    import ChatWindowExample from './examples/ChatWindowExample'
 *    
 *    function App() {
 *      return <ChatWindowExample />
 *    }
 * 
 * Features:
 * - Real-time streaming responses
 * - Code syntax highlighting with copy functionality
 * - Session management
 * - Material UI design
 * - Responsive layout
 * - Error handling
 * - Auto-scroll to latest messages
 */ 