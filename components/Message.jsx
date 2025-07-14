import React from 'react'
import { 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Box, 
  Typography, 
  Paper,
  Chip
} from '@mui/material'
import { 
  Person as PersonIcon, 
  SmartToy as BotIcon,
  MoreHoriz as TypingIcon
} from '@mui/icons-material'
import { formatDistanceToNow } from '../utils/dateUtils'
import CodeBlock from './CodeBlock'

const Message = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'

  const formatMessageContent = (content) => {
    if (!content) return ''
    
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

  const parts = formatMessageContent(message.content)

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        mb: 2
      }}
    >
      <ListItemAvatar sx={{ minWidth: 40 }}>
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            width: 32,
            height: 32
          }}
        >
          {isUser ? <PersonIcon /> : <BotIcon />}
        </Avatar>
      </ListItemAvatar>
      
      <Box sx={{ 
        flex: 1, 
        ml: isUser ? 0 : 1, 
        mr: isUser ? 1 : 0,
        maxWidth: '70%'
      }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: isUser ? 'primary.main' : 'background.paper',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
            border: isUser ? 'none' : '1px solid',
            borderColor: 'divider'
          }}
        >
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {part.type === 'text' ? (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    mb: index < parts.length - 1 ? 1 : 0
                  }}
                >
                  {part.content}
                </Typography>
              ) : (
                <CodeBlock 
                  code={part.content}
                  language={part.language}
                  sx={{ mb: index < parts.length - 1 ? 1 : 0 }}
                />
              )}
            </React.Fragment>
          ))}
          
          {isStreaming && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TypingIcon sx={{ fontSize: 16, mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                AI is typing...
              </Typography>
            </Box>
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

export default Message 