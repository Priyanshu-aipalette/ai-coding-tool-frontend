import React from 'react'
import {
  Button,
  Chip,
  Box,
  Fade,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Code as CodeIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  OpenInNew as OpenIcon
} from '@mui/icons-material'
import { useChatContext } from '../context/ChatContext'

const InlineViewArtifactButton = ({ 
  variant = 'button', // 'button', 'chip', 'icon'
  size = 'small',
  sx = {}
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

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleSidebar()
  }

  // Calculate code metrics
  const lineCount = generatedCode.split('\n').length
  const charCount = generatedCode.length

  // Determine language hint
  const getLanguageHint = (code) => {
    if (code.includes('<html') || code.includes('<!DOCTYPE')) return 'HTML'
    if (code.includes('function') || code.includes('const ') || code.includes('=>')) return 'JS'
    if (code.includes('def ') || code.includes('import ')) return 'Python'
    if (code.includes('#include') || code.includes('int main')) return 'C++'
    if (code.includes('public class')) return 'Java'
    if (code.includes('{') && code.includes(':')) return 'JSON'
    return 'Code'
  }

  const languageHint = getLanguageHint(generatedCode)
  
  // Button text and props
  const buttonText = isSidebarOpen ? 'Hide Generated Artifact' : 'View Generated Artifact'
  const icon = isSidebarOpen ? <HideIcon fontSize={size} /> : <ViewIcon fontSize={size} />
  const tooltipText = isSidebarOpen 
    ? 'Hide generated artifact' 
    : `View generated artifact (${lineCount} lines)`

  const commonSx = {
    textTransform: 'none',
    borderRadius: 2,
    ...sx
  }

  if (variant === 'chip') {
    return (
      <Fade in={true} timeout={300}>
        <Tooltip title={tooltipText} arrow>
          <Chip
            icon={icon}
            label={buttonText}
            onClick={handleClick}
            color={isSidebarOpen ? "secondary" : "primary"}
            variant={isSidebarOpen ? "filled" : "outlined"}
            size={size}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 2
              },
              transition: 'all 0.2s ease-in-out',
              ...commonSx
            }}
          />
        </Tooltip>
      </Fade>
    )
  }

  if (variant === 'icon') {
    return (
      <Fade in={true} timeout={300}>
        <Tooltip title={tooltipText} arrow>
          <IconButton
            onClick={handleClick}
            color={isSidebarOpen ? "secondary" : "primary"}
            size={size}
            sx={{
              bgcolor: isSidebarOpen ? 'secondary.light' : 'primary.light',
              color: isSidebarOpen ? 'secondary.contrastText' : 'primary.contrastText',
              '&:hover': {
                bgcolor: isSidebarOpen ? 'secondary.main' : 'primary.main',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out',
              ...commonSx
            }}
          >
            {icon}
          </IconButton>
        </Tooltip>
      </Fade>
    )
  }

  // Default button variant
  return (
    <Fade in={true} timeout={300}>
      <Tooltip title={tooltipText} arrow>
        <Button
          startIcon={icon}
          onClick={handleClick}
          variant={isSidebarOpen ? "contained" : "outlined"}
          color={isSidebarOpen ? "secondary" : "primary"}
          size={size}
          sx={{
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: 3
            },
            transition: 'all 0.2s ease-in-out',
            ...commonSx
          }}
        >
          {buttonText}
        </Button>
      </Tooltip>
    </Fade>
  )
}

export default InlineViewArtifactButton 