import React from 'react'
import {
  Fab,
  Tooltip,
  Badge,
  Zoom,
  Box
} from '@mui/material'
import {
  Code as CodeIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon
} from '@mui/icons-material'
import { useChatContext } from '../context/ChatContext'

const ViewArtifactButton = ({ 
  position = 'fixed',
  bottom = 24,
  right = 24,
  zIndex = 1000
}) => {
  const {
    generatedCode,
    isSidebarOpen,
    toggleSidebar
  } = useChatContext()

  // Don't render if no generated code
  if (!generatedCode || !generatedCode.trim()) {
    return null
  }

  const handleClick = () => {
    toggleSidebar()
  }

  // Calculate approximate line count for badge
  const lineCount = generatedCode.split('\n').length
  const charCount = generatedCode.length

  // Determine icon based on sidebar state
  const icon = isSidebarOpen ? <HideIcon /> : <ViewIcon />
  
  // Tooltip text
  const tooltipText = isSidebarOpen 
    ? 'Hide Generated Artifact' 
    : `View Generated Artifact (${lineCount} lines, ${charCount} chars)`

  return (
    <Zoom in={true} timeout={300}>
      <Box
        sx={{
          position,
          bottom,
          right,
          zIndex
        }}
      >
        <Tooltip 
          title={tooltipText}
          placement="left"
          arrow
        >
          <Badge
            badgeContent={lineCount > 99 ? '99+' : lineCount}
            color="primary"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                minWidth: '20px',
                height: '20px'
              }
            }}
          >
            <Fab
              color={isSidebarOpen ? "secondary" : "primary"}
              onClick={handleClick}
              size="large"
              sx={{
                boxShadow: 3,
                transition: 'all 0.2s ease-in-out',
                background: isSidebarOpen 
                  ? 'linear-gradient(45deg, #f44336 30%, #ff9800 90%)'
                  : 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'scale(1.05)',
                  background: isSidebarOpen
                    ? 'linear-gradient(45deg, #d32f2f 30%, #f57c00 90%)'
                    : 'linear-gradient(45deg, #1976d2 30%, #0288d1 90%)'
                }
              }}
            >
              {icon}
            </Fab>
          </Badge>
        </Tooltip>
      </Box>
    </Zoom>
  )
}

export default ViewArtifactButton 