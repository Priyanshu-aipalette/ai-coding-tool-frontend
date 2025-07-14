import React from 'react'
import { Box, Typography, Paper, Grid } from '@mui/material'
import ChatWindow from '../components/ChatWindow'

const ChatWindowDemo = () => {
  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 3 }}>
      {/* <Typography variant="h4" gutterBottom align="center">
        ChatWindow Component Demo
      </Typography> */}
{/*       
      <Typography variant="body1" paragraph align="center" color="text.secondary">
        A complete chat interface with real-time streaming, code highlighting, and Material UI design.
      </Typography> */}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Full-size chat window */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ height: '80vh', overflow: 'hidden' }}>
            <ChatWindow height="100%" />
          </Paper>
        </Grid>

      </Grid>

    </Box>
  )
}

export default ChatWindowDemo 