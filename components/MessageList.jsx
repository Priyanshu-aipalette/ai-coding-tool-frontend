import React, { useEffect, useRef } from 'react'
import { Box, List } from '@mui/material'
import { useChatContext } from '../context/ChatContext'
import Message from './Message'

const MessageList = () => {
  const { messages, isLoading, isStreaming } = useChatContext()
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isStreaming])

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        flex: 1, 
        overflow: 'auto',
        px: 2,
        py: 1
      }}
    >
      <List sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
        {messages.map((message, index) => (
          <Message 
            key={index} 
            message={message} 
            isStreaming={isStreaming && index === messages.length - 1}
          />
        ))}
        <div ref={messagesEndRef} />
      </List>
    </Box>
  )
}

export default MessageList 