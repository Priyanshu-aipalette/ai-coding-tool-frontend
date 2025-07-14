import React, { useState } from 'react'
import { 
  Box, 
  IconButton, 
  Typography, 
  Paper,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material'
import { 
  ContentCopy as CopyIcon,
  Check as CheckIcon 
} from '@mui/icons-material'

const CodeBlock = ({ code, language = 'text', sx = {} }) => {
  const [copied, setCopied] = useState(false)
  const [showCopySuccess, setShowCopySuccess] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setShowCopySuccess(true)
      
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const handleCloseCopySuccess = () => {
    setShowCopySuccess(false)
  }

  return (
    <>
      <Paper 
        elevation={0}
        sx={{
          bgcolor: 'grey.900',
          color: 'common.white',
          borderRadius: 1,
          overflow: 'hidden',
          ...sx
        }}
      >
        {/* Header with language and copy button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: 2,
          py: 1,
          bgcolor: 'grey.800',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="caption" sx={{ color: 'grey.400' }}>
            {language}
          </Typography>
          
          <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{ 
                color: copied ? 'success.main' : 'grey.400',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Code content */}
        <Box sx={{ p: 2, overflow: 'auto' }}>
          <Typography
            component="pre"
            sx={{
              margin: 0,
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              fontSize: '0.875rem',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              color: 'common.white'
            }}
          >
            {code}
          </Typography>
        </Box>
      </Paper>
      
      <Snackbar
        open={showCopySuccess}
        autoHideDuration={2000}
        onClose={handleCloseCopySuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseCopySuccess} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Code copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  )
}

export default CodeBlock 