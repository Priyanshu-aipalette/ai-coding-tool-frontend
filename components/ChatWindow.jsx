import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Avatar,
  TextField,
  IconButton,
  Typography,
  Divider,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material'
import {
  Send as SendIcon,
  Person as PersonIcon,
  SmartToy as BotIcon,
  MoreHoriz as TypingIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon
} from '@mui/icons-material'
import { useChatContext } from '../context/ChatContext'
import { formatDistanceToNow } from '../utils/dateUtils'
import ViewArtifactButton from './ViewArtifactButton'
import InlineViewArtifactButton from './InlineViewArtifactButton'

const ChatWindow = ({ height = '100%', showWelcome = true }) => {
  const [inputMessage, setInputMessage] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    isStreaming,
    error,
    clearError,
    currentSessionId
  } = useChatContext()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages, isStreaming])

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading || isStreaming) return

    const messageToSend = inputMessage.trim()
    setInputMessage('')

    try {
      await sendMessage(messageToSend, true) // Use streaming
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleCopyMessage = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedIndex(index)
      setShowCopySuccess(true)
      
      setTimeout(() => {
        setCopiedIndex(null)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy message:', error)
    }
  }

  const handleCloseCopySuccess = () => {
    setShowCopySuccess(false)
  }

  const formatMessageContent = (content) => {
    if (!content) return [{ type: 'text', content: '' }]
    
    // Split content by code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        })
      }
      
      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2]
      })
      
      lastIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      })
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content }]
  }

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user'
    const isLastMessage = index === messages.length - 1
    const isStreamingThisMessage = isStreaming && isLastMessage && !isUser
    const parts = formatMessageContent(message.content)

    return (
      <ListItem
        key={index}
        alignItems="flex-start"
        sx={{
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          mb: 2.5,
          px: 2
        }}
      >
        <ListItemAvatar sx={{ minWidth: 40 }}>
          <Avatar
            sx={{
              bgcolor: isUser ? 'primary.main' : 'secondary.main',
              width: 36,
              height: 36,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            {isUser ? <PersonIcon /> : <BotIcon />}
          </Avatar>
        </ListItemAvatar>
        
        <Box sx={{ 
          flex: 1, 
          ml: isUser ? 0 : 1.5, 
          mr: isUser ? 1.5 : 0,
          maxWidth: '75%',
          position: 'relative'
        }}>
          <Paper
            elevation={3}
            sx={{
              p: 2.5,
              bgcolor: isUser ? 'primary.main' : 'white',
              color: isUser ? 'primary.contrastText' : 'text.primary',
              borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              border: 'none',
              position: 'relative',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              '&::before': isUser ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                right: -6,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '0 12px 12px 0',
                borderColor: 'transparent',
                borderRightColor: 'primary.main'
              } : {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: -6,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '0 0 12px 12px',
                borderColor: 'transparent',
                borderLeftColor: 'white'
              }
            }}
          >
            {parts.map((part, partIndex) => (
              <React.Fragment key={partIndex}>
                {part.type === 'text' ? (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      mb: partIndex < parts.length - 1 ? 1 : 0
                    }}
                  >
                    {part.content}
                  </Typography>
                ) : (
                  <Paper
                    elevation={2}
                    sx={{
                      bgcolor: 'grey.900',
                      color: 'common.white',
                      borderRadius: 2,
                      overflow: 'hidden',
                      mb: partIndex < parts.length - 1 ? 1 : 0,
                      border: '1px solid',
                      borderColor: 'grey.700'
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      bgcolor: 'grey.800',
                      borderBottom: '1px solid',
                      borderColor: 'grey.700'
                    }}>
                      <Typography variant="caption" sx={{ 
                        color: 'grey.300',
                        fontWeight: 'medium',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {part.language}
                      </Typography>
                      <Tooltip title="Copy code">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyMessage(part.content, `${index}-${partIndex}`)}
                          sx={{ 
                            color: 'grey.400',
                            '&:hover': {
                              color: 'white',
                              bgcolor: 'grey.700'
                            }
                          }}
                        >
                          {copiedIndex === `${index}-${partIndex}` ? 
                            <CheckIcon fontSize="small" /> : 
                            <CopyIcon fontSize="small" />
                          }
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography
                        component="pre"
                        sx={{
                          margin: 0,
                          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                          color: 'common.white'
                        }}
                      >
                        {part.content}
                      </Typography>
                    </Box>
                  </Paper>
                )}
              </React.Fragment>
            ))}
            
            {isStreamingThisMessage && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TypingIcon sx={{ fontSize: 16, mr: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  AI is typing...
                </Typography>
              </Box>
            )}

            {/* Copy button for text messages */}
            {!isUser && message.content && (
              <Tooltip title="Copy message">
                <IconButton
                  size="small"
                  onClick={() => handleCopyMessage(message.content, index)}
                  sx={{ 
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    opacity: 0.7,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  {copiedIndex === index ? 
                    <CheckIcon fontSize="small" /> : 
                    <CopyIcon fontSize="small" />
                  }
                </IconButton>
              </Tooltip>
            )}
          </Paper>
          
          {message.timestamp && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: 'block',
                mt: 0.5,
                textAlign: isUser ? 'right' : 'left'
              }}
            >
              {formatDistanceToNow(new Date(message.timestamp))}
            </Typography>
          )}
        </Box>
      </ListItem>
    )
  }

  const renderWelcomeMessage = () => {
    const currentHour = new Date().getHours()
    let greeting = "Good morning"
    if (currentHour >= 12 && currentHour < 17) greeting = "Good afternoon"
    else if (currentHour >= 17) greeting = "Good evening"

    const suggestions = [
      { label: "Code", icon: "💻", prompt: "Help me write some code" },
      { label: "Debug", icon: "🔧", prompt: "Help me debug this error" },
      { label: "Learn", icon: "📚", prompt: "Explain a programming concept" },
      { label: "Review", icon: "🔍", prompt: "Review my code for improvements" },
      { label: "Optimize", icon: "⚡", prompt: "Help me optimize this code" }
    ]

    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 4,
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Greeting */}
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 300,
            mb: 6,
            color: 'text.primary',
            textAlign: 'center'
          }}
        >
          🌟 {greeting}, Developer
        </Typography>

        {/* Main Input Area */}
        <Box sx={{ 
          width: '100%',
          maxWidth: '600px',
          mb: 4
        }}>
          <TextField
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How can I help you today?"
            disabled={isLoading || isStreaming}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: 'background.paper',
                fontSize: '1.1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                '&.Mui-focused': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                }
              },
              '& .MuiOutlinedInput-input': {
                padding: '20px 24px',
              }
            }}
            InputProps={{
              endAdornment: inputMessage.trim() && (
                <IconButton
                  onClick={handleSend}
                  disabled={!inputMessage.trim() || isLoading || isStreaming}
                  color="primary"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    mr: 1,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '&:disabled': {
                      bgcolor: 'action.disabled',
                    }
                  }}
                >
                  {isLoading || isStreaming ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )}
                </IconButton>
              )
            }}
          />
        </Box>

        {/* Suggestion Buttons */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          maxWidth: '600px'
        }}>
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => {
                setInputMessage(suggestion.prompt)
                // Auto-focus the input after setting the message
                setTimeout(() => {
                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }, 100)
              }}
              sx={{
                borderRadius: '25px',
                px: 3,
                py: 1.5,
                borderColor: 'divider',
                color: 'text.secondary',
                bgcolor: 'background.paper',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  bgcolor: 'primary.50',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{suggestion.icon}</span>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {suggestion.label}
                </Typography>
              </Box>
            </Button>
          ))}
        </Box>

        {/* Subtle Footer */}
        <Typography 
          variant="body2" 
          color="text.disabled" 
          sx={{ 
            mt: 4,
            textAlign: 'center',
            opacity: 0.6
          }}
        >
          Your intelligent coding assistant powered by Gemini 2.5
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      height, 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.default',
      position: 'relative'
    }}>
      {/* Header - Only show when there are messages */}
      {messages.length > 0 && (
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 10
        }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <BotIcon sx={{ mr: 1, color: 'primary.main' }} />
            AI Coding Agent
            {currentSessionId && (
              <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                Session: {currentSessionId.slice(-8)}
              </Typography>
            )}
          </Typography>
        </Box>
      )}

      {/* Messages Area */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        bgcolor: 'background.default',
        position: 'relative',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.05)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(0,0,0,0.4)',
        }
      }}>
        {messages.length === 0 && showWelcome ? (
          renderWelcomeMessage()
        ) : (
          <List sx={{ py: 2, px: 1 }}>
            {messages.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Box>

      {messages.length > 0 && <Divider />}

      {/* Input Area - Only show when there are messages */}
      {messages.length > 0 && (
        <Box sx={{ 
          p: 2, 
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
        }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your coding question or request..."
            disabled={isLoading || isStreaming}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                bgcolor: 'grey.50',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
                '&.Mui-focused': {
                  bgcolor: 'white',
                }
              },
              '& .MuiOutlinedInput-input': {
                padding: '14px 20px',
              }
            }}
          />
          
          <Tooltip title={isLoading || isStreaming ? 'AI is responding...' : 'Send message (Enter)'}>
            <span>
              <IconButton
                onClick={handleSend}
                disabled={!inputMessage.trim() || isLoading || isStreaming}
                color="primary"
                size="large"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'scale(1.05)',
                  },
                  '&:disabled': {
                    bgcolor: 'action.disabled',
                    transform: 'none',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {isLoading || isStreaming ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        
                 {/* Status indicator */}
         {(isLoading || isStreaming) && (
           <Box sx={{ 
             display: 'flex', 
             alignItems: 'center', 
             gap: 1,
             mt: 1,
             fontSize: '0.75rem',
             color: 'text.secondary'
           }}>
             <CircularProgress size={12} />
             {isStreaming ? 'AI is typing...' : 'Sending...'}
           </Box>
         )}
         
         {/* Inline View Artifact Button */}
         <Box sx={{ 
           display: 'flex', 
           justifyContent: 'flex-end', 
           mt: 1 
         }}>
           <InlineViewArtifactButton variant="button" size="small" />
         </Box>
       </Box>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={showCopySuccess}
        autoHideDuration={2000}
        onClose={handleCloseCopySuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseCopySuccess} severity="success" sx={{ width: '100%' }}>
          Content copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  )
}
export default ChatWindow 