import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack
} from '@mui/material'
import {
  Code as CodeIcon,
  Html as HtmlIcon,
  Code as JavaScriptIcon,
  Css as CssIcon
} from '@mui/icons-material'
import { useChatContext } from '../context/ChatContext'

const SidebarExample = () => {
  const {
    setGeneratedCode,
    toggleSidebar,
    isSidebarOpen,
    generatedCode
  } = useChatContext()

  const [customCode, setCustomCode] = useState('')

  // Sample code examples
  const codeExamples = [
    {
      title: 'HTML Card Component',
      language: 'html',
      icon: <HtmlIcon />,
      code: `<div style="max-width: 400px; margin: 20px auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
  <div style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
  <div style="padding: 20px;">
    <h2 style="margin: 0 0 10px 0; color: #333;">Beautiful Card</h2>
    <p style="color: #666; line-height: 1.6;">This is a beautiful card component with a gradient header and clean typography.</p>
    <button style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Click Me</button>
  </div>
</div>`
    },
    {
      title: 'JavaScript Animation',
      language: 'javascript',
      icon: <JavaScriptIcon />,
      code: `// Create animated bouncing ball
const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 300;
canvas.style.border = '1px solid #ccc';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let x = 50, y = 50, dx = 3, dy = 2;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw ball
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.fillStyle = '#667eea';
  ctx.fill();
  
  // Update position
  x += dx;
  y += dy;
  
  // Bounce off walls
  if (x > canvas.width - 20 || x < 20) dx = -dx;
  if (y > canvas.height - 20 || y < 20) dy = -dy;
  
  requestAnimationFrame(animate);
}

animate();
console.log('Bouncing ball animation started!');`
    },
    {
      title: 'CSS Grid Layout',
      language: 'html',
      icon: <CssIcon />,
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    .grid-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .grid-item {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      transition: transform 0.3s ease;
    }
    .grid-item:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <h1 style="text-align: center; color: #333;">CSS Grid Layout</h1>
  <div class="grid-container">
    <div class="grid-item">Item 1</div>
    <div class="grid-item">Item 2</div>
    <div class="grid-item">Item 3</div>
    <div class="grid-item">Item 4</div>
    <div class="grid-item">Item 5</div>
    <div class="grid-item">Item 6</div>
  </div>
</body>
</html>`
    },
    {
      title: 'React Counter Component',
      language: 'javascript',
      icon: <JavaScriptIcon />,
      code: `// React Counter Component (for demonstration)
function Counter() {
  const [count, setCount] = React.useState(0);
  
  return React.createElement('div', {
    style: {
      textAlign: 'center',
      padding: '20px',
      maxWidth: '300px',
      margin: '20px auto',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }
  }, [
    React.createElement('h2', { key: 'title' }, 'Counter: ' + count),
    React.createElement('button', {
      key: 'increment',
      onClick: () => setCount(count + 1),
      style: {
        background: '#667eea',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        margin: '5px',
        borderRadius: '5px',
        cursor: 'pointer'
      }
    }, '+'),
    React.createElement('button', {
      key: 'decrement',
      onClick: () => setCount(count - 1),
      style: {
        background: '#f44336',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        margin: '5px',
        borderRadius: '5px',
        cursor: 'pointer'
      }
    }, '-')
  ]);
}

// Note: This would need React library loaded to work
console.log('React Counter component defined');`
    }
  ]

  const handleSetCode = (code) => {
    setGeneratedCode(code)
    if (!isSidebarOpen) {
      toggleSidebar()
    }
  }

  const handleSetCustomCode = () => {
    if (customCode.trim()) {
      setGeneratedCode(customCode.trim())
      if (!isSidebarOpen) {
        toggleSidebar()
      }
    }
  }

  const handleClearCode = () => {
    setGeneratedCode('')
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sidebar Demo
      </Typography>
      
      <Typography variant="body1" paragraph>
        This demo shows the Sidebar component with Monaco Editor and live preview functionality.
        Click on any code example below to load it into the sidebar.
      </Typography>

      {/* Current Status */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">
            Sidebar Status:
          </Typography>
          <Chip 
            label={isSidebarOpen ? "Open" : "Closed"} 
            color={isSidebarOpen ? "success" : "default"} 
          />
          {generatedCode && (
            <Chip 
              label={`${generatedCode.length} characters loaded`} 
              color="primary" 
              size="small"
            />
          )}
          <Button
            variant="outlined"
            size="small"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? "Close" : "Open"} Sidebar
          </Button>
          {generatedCode && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleClearCode}
            >
              Clear Code
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Custom Code Input */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Custom Code
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          placeholder="Enter your own code here..."
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSetCustomCode}
          disabled={!customCode.trim()}
        >
          Load Custom Code
        </Button>
      </Paper>

      {/* Code Examples */}
      <Typography variant="h6" gutterBottom>
        Code Examples
      </Typography>
      
      <Grid container spacing={3}>
        {codeExamples.map((example, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {example.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {example.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Language: {example.language}
                </Typography>
                
                <Box
                  component="pre"
                  sx={{
                    fontSize: '0.75rem',
                    background: 'grey.100',
                    p: 1,
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: 150,
                    fontFamily: 'monospace'
                  }}
                >
                  {example.code.substring(0, 200)}...
                </Box>
              </CardContent>
              
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleSetCode(example.code)}
                  startIcon={<CodeIcon />}
                >
                  Load in Sidebar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Instructions */}
      <Paper elevation={0} sx={{ p: 3, mt: 4, bgcolor: 'info.main', color: 'info.contrastText' }}>
        <Typography variant="h6" gutterBottom>
          How to Use the Sidebar
        </Typography>
        <ol>
          <li>Click on any code example above to load it into the sidebar</li>
          <li>Use the sidebar toggle button in the header to open/close the sidebar</li>
          <li>Switch between "Code" and "Preview" tabs in the sidebar</li>
          <li>In the Code tab: Edit code with Monaco Editor, copy, or download</li>
          <li>In the Preview tab: See live HTML/JavaScript execution</li>
          <li>Click "Run" to update the preview with your changes</li>
        </ol>
      </Paper>
    </Box>
  )
}

export default SidebarExample 