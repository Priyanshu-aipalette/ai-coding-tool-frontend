import React, { useState, useRef, useEffect } from 'react'
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Tooltip,
  CircularProgress
} from '@mui/material'
import { 
  Send as SendIcon, 
  Stop as StopIcon 
} from '@mui/icons-material'
import { useChatContext } from '../context/ChatContext'

const MessageInput = () => {
  const [message, setMessage] = useState('')
  const [isMultiline, setIsMultiline] = useState(false)
  const { sendMessage, isLoading, isStreaming } = useChatContext()
  const inputRef = useRef(null)

  const handleSend = async () => {
    if (!message.trim() || isLoading) return
    
    const messageToSend = message.trim()
    setMessage('')
    setIsMultiline(false)
    
    try {
      await sendMessage(messageToSend, true) // Use streaming by default
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    } else if (event.key === 'Enter' && event.shiftKey) {
      setIsMultiline(true)
    }
  }

  const handleChange = (event) => {
    setMessage(event.target.value)
    
    // Auto-expand for multiline
    if (event.target.value.includes('\n') && !isMultiline) {
      setIsMultiline(true)
    }
  }

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const canSend = message.trim() && !isLoading && !isStreaming

  return (
    <Box sx={{ 
      p: 2, 
      borderTop: '1px solid', 
      borderColor: 'divider',
      bgcolor: 'background.paper'
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            minRows={1}
            maxRows={6}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your coding question or request..."
            variant="outlined"
            disabled={isLoading || isStreaming}
            sx={{
              '& .MuiOutlinedInput-root': {
                border: 'none',
                '& fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-root': {
                padding: '12px 16px',
              }
            }}
          />
          
          <Box sx={{ p: 1 }}>
            <Tooltip 
              title={
                isLoading || isStreaming 
                  ? 'AI is responding...' 
                  : 'Send message (Enter)'
              }
            >
              <span>
                <IconButton
                  onClick={handleSend}
                  disabled={!canSend}
                  color="primary"
                  sx={{
                    bgcolor: canSend ? 'primary.main' : 'action.disabled',
                    color: canSend ? 'primary.contrastText' : 'action.disabled',
                    '&:hover': {
                      bgcolor: canSend ? 'primary.dark' : 'action.disabled',
                    },
                    '&:disabled': {
                      bgcolor: 'action.disabled',
                      color: 'action.disabled',
                    }
                  }}
                >
                  {isLoading || isStreaming ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 1,
        px: 1
      }}>
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          Press Enter to send, Shift+Enter for new line
        </Box>
        
        {(isLoading || isStreaming) && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: '0.75rem',
            color: 'text.secondary'
          }}>
            <CircularProgress size={12} />
            {isStreaming ? 'AI is typing...' : 'Sending...'}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MessageInput 