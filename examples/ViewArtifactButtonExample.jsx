import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Stack,
  Chip,
  Alert,
  Divider
} from '@mui/material'
import {
  Code as CodeIcon,
  Html as HtmlIcon,
  Code as JavaScriptIcon,
  DataObject as JsonIcon,
  Delete as ClearIcon
} from '@mui/icons-material'
import { useChatContext } from '../context/ChatContext'
import ViewArtifactButton from '../components/ViewArtifactButton'
import InlineViewArtifactButton from '../components/InlineViewArtifactButton'

const ViewArtifactButtonExample = () => {
  const {
    setGeneratedCode,
    generatedCode,
    isSidebarOpen,
    toggleSidebar
  } = useChatContext()

  // Sample code snippets
  const codeExamples = [
    {
      title: 'React Component',
      type: 'javascript',
      icon: <JavaScriptIcon color="warning" />,
      description: 'A simple React counter component',
      code: `function Counter() {
  const [count, setCount] = React.useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Counter: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

// Render the component
ReactDOM.render(<Counter />, document.getElementById('root'));`
    },
    {
      title: 'HTML Landing Page',
      type: 'html',
      icon: <HtmlIcon color="error" />,
      description: 'A beautiful landing page with CSS',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Landing Page</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            max-width: 600px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .btn {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to the Future</h1>
        <p>Experience the next generation of web technology</p>
        <button class="btn">Get Started</button>
    </div>
</body>
</html>`
    },
    {
      title: 'API Configuration',
      type: 'json',
      icon: <JsonIcon color="info" />,
      description: 'REST API configuration file',
      code: `{
  "api": {
    "version": "1.0.0",
    "baseUrl": "https://api.example.com",
    "timeout": 5000,
    "retries": 3
  },
  "endpoints": {
    "users": {
      "list": "/users",
      "create": "/users",
      "update": "/users/:id",
      "delete": "/users/:id"
    },
    "auth": {
      "login": "/auth/login",
      "logout": "/auth/logout",
      "refresh": "/auth/refresh"
    }
  },
  "headers": {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  "security": {
    "cors": true,
    "https": true,
    "tokenExpiry": "24h"
  }
}`
    },
    {
      title: 'CSS Animation',
      type: 'html',
      icon: <HtmlIcon color="secondary" />,
      description: 'Pure CSS loading animation',
      code: `<!DOCTYPE html>
<html>
<head>
    <style>
        .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 50px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .pulse {
            width: 20px;
            height: 20px;
            background: #ff6b6b;
            border-radius: 50%;
            margin: 20px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
        }
    </style>
</head>
<body>
    <h1>CSS Animations</h1>
    <div class="loader"></div>
    <div class="pulse"></div>
    <p>Beautiful CSS-only animations!</p>
</body>
</html>`
    }
  ]

  const handleLoadCode = (code) => {
    setGeneratedCode(code)
  }

  const handleClearCode = () => {
    setGeneratedCode('')
  }

  const getCodeStats = () => {
    if (!generatedCode) return null
    const lines = generatedCode.split('\n').length
    const chars = generatedCode.length
    const words = generatedCode.split(/\s+/).length
    return { lines, chars, words }
  }

  const stats = getCodeStats()

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 3, position: 'relative' }}>
      <Typography variant="h4" gutterBottom>
        ViewArtifactButton Demo
      </Typography>
      
      <Typography variant="body1" paragraph>
        The ViewArtifactButton appears when there's generated code and allows users to toggle the sidebar.
        Load some code examples below to see the "View Generated Artifact" button in action!
      </Typography>

      {/* Current Status */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h6">
            Status:
          </Typography>
          <Chip 
            label={generatedCode ? "Code Loaded" : "No Code"} 
            color={generatedCode ? "success" : "default"} 
          />
          <Chip 
            label={isSidebarOpen ? "Sidebar Open" : "Sidebar Closed"} 
            color={isSidebarOpen ? "primary" : "default"} 
          />
          {stats && (
            <Chip 
              label={`${stats.lines} lines, ${stats.chars} chars`} 
              size="small"
              variant="outlined"
            />
          )}
          {generatedCode && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<ClearIcon />}
              onClick={handleClearCode}
            >
              Clear Code
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Button Variants Demo */}
      {generatedCode && (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Button Variants
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <InlineViewArtifactButton variant="button" size="small" />
            <InlineViewArtifactButton variant="chip" size="small" />
            <InlineViewArtifactButton variant="icon" size="small" />
          </Stack>
        </Paper>
      )}

      {/* Code Examples */}
      <Typography variant="h6" gutterBottom>
        Code Examples
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {codeExamples.map((example, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              elevation={2} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: generatedCode === example.code ? '2px solid' : '1px solid',
                borderColor: generatedCode === example.code ? 'primary.main' : 'divider'
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {example.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {example.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {example.description}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  Type: {example.type} • Lines: {example.code.split('\n').length}
                </Typography>
              </CardContent>
              
              <CardActions>
                <Button
                  size="small"
                  variant={generatedCode === example.code ? "contained" : "outlined"}
                  onClick={() => handleLoadCode(example.code)}
                  startIcon={<CodeIcon />}
                >
                  {generatedCode === example.code ? "Loaded" : "Load Code"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Instructions */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          How to Test
        </Typography>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Click "Load Code" on any example above</li>
          <li>Look for the "View Generated Artifact" button that appears (floating button bottom-right or inline buttons)</li>
          <li>Click the button to toggle the sidebar</li>
          <li>Try different button variants and see how they behave</li>
          <li>Load different code types to see the artifact display in action</li>
        </ol>
      </Alert>

      {/* Feature List */}
      <Paper elevation={0} sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          ViewArtifactButton Features
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Only appears when code artifact is generated</li>
              <li>Toggles sidebar visibility</li>
              <li>Shows "View Generated Artifact" label</li>
              <li>Displays code metrics (lines, characters)</li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Multiple variants (button, chip, icon)</li>
              <li>Smooth animations and transitions</li>
              <li>Responsive design</li>
              <li>Accessible with proper tooltips</li>
            </ul>
          </Grid>
        </Grid>
      </Paper>

      {/* Floating Button (will appear when code is loaded) */}
      <ViewArtifactButton />
    </Box>
  )
}

export default ViewArtifactButtonExample 