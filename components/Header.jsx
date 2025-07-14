import React from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box,
  Tooltip,
  Button
} from '@mui/material'
import { 
  Code as CodeIcon,
  GitHub as GitHubIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  ViewSidebar as SidebarIcon,
  Menu as MenuIcon
} from '@mui/icons-material'
import { useChatContext } from '../context/ChatContext'
import { useLocation, useNavigate } from 'react-router-dom'

const Header = () => {
  const { 
    clearSession, 
    currentSessionId, 
    toggleSidebar, 
    isSidebarOpen,
    toggleLeftSidebar,
    isLeftSidebarOpen 
  } = useChatContext()
  const location = useLocation()
  const navigate = useNavigate()

  const handleNewSession = () => {
    clearSession()
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={toggleLeftSidebar}
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <CodeIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Coding Agent
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Navigation buttons */}
          <Button
            color="inherit"
            onClick={() => handleNavigate('/')}
            sx={{ 
              textTransform: 'none',
              bgcolor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Chat
          </Button>
          
          <Button
            color="inherit"
            onClick={() => handleNavigate('/demo')}
            startIcon={<DashboardIcon />}
            sx={{ 
              textTransform: 'none',
              bgcolor: location.pathname === '/demo' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Demo
          </Button>
          
          <Button
            color="inherit"
            onClick={() => handleNavigate('/context')}
            sx={{ 
              textTransform: 'none',
              bgcolor: location.pathname === '/context' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Context
          </Button>
          
          <Button
            color="inherit"
            onClick={() => handleNavigate('/sidebar')}
            sx={{ 
              textTransform: 'none',
              bgcolor: location.pathname === '/sidebar' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Sidebar
          </Button>
          
          <Button
            color="inherit"
            onClick={() => handleNavigate('/view-artifact')}
            sx={{ 
              textTransform: 'none',
              bgcolor: location.pathname === '/view-artifact' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Artifact
          </Button>
          
          <Tooltip title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}>
            <IconButton 
              color="inherit" 
              onClick={toggleSidebar}
              size="small"
              sx={{
                bgcolor: isSidebarOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }}
            >
              <SidebarIcon />
            </IconButton>
          </Tooltip>
          
          {currentSessionId && (
            <Tooltip title="New Session">
              <IconButton 
                color="inherit" 
                onClick={handleNewSession}
                size="small"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="View on GitHub">
            <IconButton 
              color="inherit" 
              component="a"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header 