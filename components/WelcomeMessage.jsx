import React from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Chip
} from '@mui/material'
import { 
  Code as CodeIcon,
  BugReport as BugIcon,
  School as SchoolIcon,
  Build as BuildIcon
} from '@mui/icons-material'

const WelcomeMessage = () => {
  const features = [
    {
      icon: <CodeIcon color="primary" />,
      title: "Code Generation",
      description: "Generate code in multiple programming languages with explanations"
    },
    {
      icon: <BugIcon color="secondary" />,
      title: "Debugging Help",
      description: "Identify and fix bugs in your code with detailed explanations"
    },
    {
      icon: <SchoolIcon color="success" />,
      title: "Learning Support",
      description: "Learn programming concepts with clear examples and explanations"
    },
    {
      icon: <BuildIcon color="warning" />,
      title: "Code Review",
      description: "Get feedback on your code and suggestions for improvement"
    }
  ]

  const examplePrompts = [
    "Write a Python function to calculate fibonacci numbers",
    "Explain the difference between REST and GraphQL APIs",
    "Help me debug this JavaScript error",
    "Create a React component for a user profile card",
    "Write a SQL query to find the top 10 customers"
  ]

  return (
    <Box sx={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      p: 3,
      textAlign: 'center'
    }}>
      <Typography variant="h3" component="h1" gutterBottom color="primary">
        Welcome to AI Coding Agent
      </Typography>
      
      <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
        Your intelligent coding assistant powered by Gemini 2.5
      </Typography>

      {/* Features Grid */}
      <Grid container spacing={3} sx={{ mb: 4, maxWidth: 800 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card 
              elevation={0} 
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                height: '100%'
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Example Prompts */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          maxWidth: 600
        }}
      >
        <Typography variant="h6" gutterBottom>
          Try asking me about:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {examplePrompts.map((prompt, index) => (
            <Chip 
              key={index}
              label={prompt}
              variant="outlined"
              size="small"
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Start by typing your coding question or request below
      </Typography>
    </Box>
  )
}

export default WelcomeMessage 