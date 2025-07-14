import React, { useState } from 'react'
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Collapse,
  Avatar,
  Button,
  Tooltip,
  Paper
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Chat as ChatIcon,
  Code as CodeIcon,
  ExpandLess,
  ExpandMore,
  History as HistoryIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { useChatContext } from '../context/ChatContext'

const LeftSidebar = () => {
  const { 
    clearSession, 
    currentSessionId, 
    isLeftSidebarOpen, 
    toggleLeftSidebar,
    chatHistory,
    loadChatSession 
  } = useChatContext()
  const [chatsExpanded, setChatsExpanded] = useState(true)
  const [artifactsExpanded, setArtifactsExpanded] = useState(true)

  // Function to format relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date()
    const chatTime = new Date(timestamp)
    const diffInHours = Math.floor((now - chatTime) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks === 1) return '1 week ago'
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`
    
    return chatTime.toLocaleDateString()
  }

  const handleChatClick = (chat) => {
    loadChatSession(chat)
  }

  // Get artifacts from chat history (sessions with generated code)
  const artifacts = chatHistory
    .filter(chat => chat.generatedCode && chat.generatedCode.trim())
    .map(chat => ({
      id: chat.id,
      title: chat.title,
      type: 'Generated Code',
      language: 'code',
      code: chat.generatedCode,
      timestamp: chat.timestamp
    }))
    .slice(0, 10) // Show latest 10 artifacts

  const handleArtifactClick = (artifact) => {
    // Load the chat session that generated this artifact
    const chatSession = chatHistory.find(chat => chat.id === artifact.id)
    if (chatSession) {
      loadChatSession(chatSession)
    }
  }

  const handleNewChat = () => {
    clearSession()
  }

  const handleToggle = () => {
    toggleLeftSidebar()
  }

  const sidebarWidth = isLeftSidebarOpen ? 280 : 60

  return (
    <Paper
      elevation={1}
      sx={{
        width: sidebarWidth,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        transition: 'width 0.3s ease-in-out',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 64
      }}>
        {isLeftSidebarOpen ? (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              AI Coding Agent
            </Typography>
            <IconButton 
              onClick={handleToggle} 
              size="small"
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <Tooltip title="Expand sidebar" placement="right">
            <IconButton 
              onClick={handleToggle} 
              size="medium"
              sx={{ 
                mx: 'auto',
                bgcolor: 'action.hover',
                '&:hover': {
                  bgcolor: 'action.selected'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* New Chat Button */}
      <Box sx={{ p: 2, pb: 1 }}>
        {isLeftSidebarOpen ? (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleNewChat}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              bgcolor: 'background.default',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            New chat
          </Button>
        ) : (
          <Tooltip title="New chat" placement="right">
            <IconButton
              onClick={handleNewChat}
              sx={{
                width: '100%',
                height: 40,
                borderRadius: 2,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Chats Section */}
        <Box sx={{ px: 1 }}>
          <ListItemButton
            onClick={() => setChatsExpanded(!chatsExpanded)}
            sx={{ borderRadius: 1, mb: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <ChatIcon fontSize="small" />
            </ListItemIcon>
            {isLeftSidebarOpen && (
              <>
                <ListItemText 
                  primary="Chats" 
                  primaryTypographyProps={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500,
                    color: 'text.secondary'
                  }}
                />
                {chatsExpanded ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>

          <Collapse in={chatsExpanded && isLeftSidebarOpen} timeout="auto" unmountOnExit>
            <List dense sx={{ pl: 1 }}>
              {chatHistory.length === 0 ? (
                <ListItem sx={{ py: 2 }}>
                  <ListItemText 
                    primary="No chats yet"
                    secondary="Start a conversation to see your chat history"
                    primaryTypographyProps={{ 
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      textAlign: 'center'
                    }}
                    secondaryTypographyProps={{ 
                      fontSize: '0.75rem',
                      color: 'text.disabled',
                      textAlign: 'center'
                    }}
                  />
                </ListItem>
              ) : (
                chatHistory.map((chat) => (
                  <ListItemButton
                    key={chat.id}
                    onClick={() => handleChatClick(chat)}
                    sx={{ 
                      borderRadius: 1,
                      mb: 0.5,
                      bgcolor: currentSessionId === chat.id ? 'action.selected' : 'transparent',
                      '&:hover': {
                        bgcolor: currentSessionId === chat.id ? 'action.selected' : 'action.hover'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <HistoryIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={chat.title}
                      secondary={formatRelativeTime(chat.timestamp)}
                      primaryTypographyProps={{ 
                        fontSize: '0.875rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: currentSessionId === chat.id ? 500 : 400
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: '0.75rem',
                        color: 'text.disabled'
                      }}
                    />
                  </ListItemButton>
                ))
              )}
            </List>
          </Collapse>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Artifacts Section */}
        <Box sx={{ px: 1 }}>
          <ListItemButton
            onClick={() => setArtifactsExpanded(!artifactsExpanded)}
            sx={{ borderRadius: 1, mb: 1 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CodeIcon fontSize="small" />
            </ListItemIcon>
            {isLeftSidebarOpen && (
              <>
                <ListItemText 
                  primary="Artifacts" 
                  primaryTypographyProps={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 500,
                    color: 'text.secondary'
                  }}
                />
                {artifactsExpanded ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>

          <Collapse in={artifactsExpanded && isLeftSidebarOpen} timeout="auto" unmountOnExit>
            <List dense sx={{ pl: 1 }}>
              {artifacts.length === 0 ? (
                <ListItem sx={{ py: 2 }}>
                  <ListItemText 
                    primary="No artifacts yet"
                    secondary="Generate some code to see your artifacts"
                    primaryTypographyProps={{ 
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      textAlign: 'center'
                    }}
                    secondaryTypographyProps={{ 
                      fontSize: '0.75rem',
                      color: 'text.disabled',
                      textAlign: 'center'
                    }}
                  />
                </ListItem>
              ) : (
                artifacts.map((artifact) => (
                  <ListItemButton
                    key={artifact.id}
                    onClick={() => handleArtifactClick(artifact)}
                    sx={{ 
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CodeIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={artifact.title}
                      secondary={`${artifact.type} • ${formatRelativeTime(artifact.timestamp)}`}
                      primaryTypographyProps={{ 
                        fontSize: '0.875rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      secondaryTypographyProps={{ 
                        fontSize: '0.75rem',
                        color: 'text.disabled'
                      }}
                    />
                  </ListItemButton>
                ))
              )}
            </List>
          </Collapse>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          <PersonIcon fontSize="small" />
        </Avatar>
        {isLeftSidebarOpen && (
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Tester
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Free plan
            </Typography>
          </Box>
        )}
        {isLeftSidebarOpen && (
          <IconButton size="small">
            <SettingsIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Paper>
  )
}

export default LeftSidebar 