import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { ChatProvider, useChatContext } from '../context/ChatContext'
import ChatPage from '../pages/ChatPage'
import ChatWindowDemo from '../pages/ChatWindowDemo'
import ChatContextExample from '../examples/ChatContextExample'
import SidebarExample from '../examples/SidebarExample'
import ViewArtifactButtonExample from '../examples/ViewArtifactButtonExample'
import LeftSidebar from '../components/LeftSidebar'
import Sidebar from '../components/Sidebar'

const AppContent = () => {
  const { isLeftSidebarOpen } = useChatContext()
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        ml: isLeftSidebarOpen ? '280px' : '60px', // Dynamic margin based on sidebar state
        transition: 'margin-left 0.3s ease-in-out'
      }}>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/demo" element={<ChatWindowDemo />} />
          <Route path="/context" element={<ChatContextExample />} />
          <Route path="/sidebar" element={<SidebarExample />} />
          <Route path="/view-artifact" element={<ViewArtifactButtonExample />} />
        </Routes>
      </Box>
      
      {/* Right Sidebar (Code Editor) */}
      <Sidebar />
    </Box>
  )
}

function App() {
  return (
    <ChatProvider>
      <Router>
        <AppContent />
      </Router>
    </ChatProvider>
  )
}

export default App 