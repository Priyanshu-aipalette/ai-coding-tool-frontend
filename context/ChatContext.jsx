import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { chatService } from '../services/chatService'
import { sendPrompt } from '../services/api'
import { extractCodeBlocks, hasCodeBlocks, processCodeBlocks } from '../utils/codeExtractor'

// Create the ChatContext
const ChatContext = createContext()

// Initial state
const initialState = {
  messages: [],
  currentResponse: '',
  generatedCode: '',
  isSidebarOpen: false,
  isLeftSidebarOpen: true,
  currentSessionId: null,
  isLoading: false,
  isStreaming: false,
  error: null,
  sessionInfo: null,
  chatHistory: []
}

// Action types
const actionTypes = {
  SET_MESSAGES: 'SET_MESSAGES',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_CURRENT_RESPONSE: 'SET_CURRENT_RESPONSE',
  APPEND_CURRENT_RESPONSE: 'APPEND_CURRENT_RESPONSE',
  CLEAR_CURRENT_RESPONSE: 'CLEAR_CURRENT_RESPONSE',
  SET_GENERATED_CODE: 'SET_GENERATED_CODE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  TOGGLE_LEFT_SIDEBAR: 'TOGGLE_LEFT_SIDEBAR',
  SET_LEFT_SIDEBAR_OPEN: 'SET_LEFT_SIDEBAR_OPEN',
  SET_SESSION_ID: 'SET_SESSION_ID',
  SET_LOADING: 'SET_LOADING',
  SET_STREAMING: 'SET_STREAMING',
  SET_ERROR: 'SET_ERROR',
  SET_SESSION_INFO: 'SET_SESSION_INFO',
  CLEAR_SESSION: 'CLEAR_SESSION',
  UPDATE_LAST_MESSAGE: 'UPDATE_LAST_MESSAGE',
  ADD_TO_CHAT_HISTORY: 'ADD_TO_CHAT_HISTORY',
  SET_CHAT_HISTORY: 'SET_CHAT_HISTORY'
}

// Reducer function
const chatReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_MESSAGES:
      return { ...state, messages: action.payload }
    
    case actionTypes.ADD_MESSAGE:
      return { 
        ...state, 
        messages: [...state.messages, action.payload] 
      }
    
    case actionTypes.SET_CURRENT_RESPONSE:
      return { ...state, currentResponse: action.payload }
    
    case actionTypes.APPEND_CURRENT_RESPONSE:
      return { 
        ...state, 
        currentResponse: state.currentResponse + action.payload 
      }
    
    case actionTypes.CLEAR_CURRENT_RESPONSE:
      return { ...state, currentResponse: '' }
    
    case actionTypes.SET_GENERATED_CODE:
      return { ...state, generatedCode: action.payload }
    
    case actionTypes.TOGGLE_SIDEBAR:
      return { ...state, isSidebarOpen: !state.isSidebarOpen }
    
    case actionTypes.SET_SIDEBAR_OPEN:
      return { ...state, isSidebarOpen: action.payload }
    
    case actionTypes.TOGGLE_LEFT_SIDEBAR:
      return { ...state, isLeftSidebarOpen: !state.isLeftSidebarOpen }
    
    case actionTypes.SET_LEFT_SIDEBAR_OPEN:
      return { ...state, isLeftSidebarOpen: action.payload }
    
    case actionTypes.SET_SESSION_ID:
      return { ...state, currentSessionId: action.payload }
    
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case actionTypes.SET_STREAMING:
      return { ...state, isStreaming: action.payload }
    
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    
    case actionTypes.SET_SESSION_INFO:
      return { ...state, sessionInfo: action.payload }
    
    case actionTypes.UPDATE_LAST_MESSAGE:
      return {
        ...state,
        messages: state.messages.map((msg, index) => 
          index === state.messages.length - 1 
            ? { ...msg, content: msg.content + action.payload }
            : msg
        )
      }
    
    case actionTypes.CLEAR_SESSION:
      return { 
        ...state, 
        messages: [],
        currentResponse: '',
        generatedCode: '',
        isSidebarOpen: false,
        currentSessionId: null,
        sessionInfo: null,
        error: null,
        isLoading: false,
        isStreaming: false
      }
    
    case actionTypes.ADD_TO_CHAT_HISTORY:
      return {
        ...state,
        chatHistory: [action.payload, ...state.chatHistory.slice(0, 19)] // Keep latest 20 chats
      }
    
    case actionTypes.SET_CHAT_HISTORY:
      return {
        ...state,
        chatHistory: action.payload
      }
    
    default:
      return state
  }
}

// ChatProvider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  // Process response for code blocks and update generatedCode
  const processResponseForCode = (response) => {
    if (!response || typeof response !== 'string') {
      return;
    }

    // Extract code blocks using the utility function
    const extractedCode = extractCodeBlocks(response);
    
    if (extractedCode) {
      console.log('Code extracted from response:', extractedCode);
      dispatch({ type: actionTypes.SET_GENERATED_CODE, payload: extractedCode });
      
      // Auto-open sidebar when code is detected
      dispatch({ type: actionTypes.SET_SIDEBAR_OPEN, payload: true });
    }
  };

  // Create a new session
  const createSession = async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      const response = await chatService.createSession()
      dispatch({ type: actionTypes.SET_SESSION_ID, payload: response.session_id })
      dispatch({ type: actionTypes.SET_ERROR, payload: null })
      return response.session_id
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      throw error
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false })
    }
  }

  // Send a message with streaming support
  const sendMessage = async (message, useStreaming = true) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      dispatch({ type: actionTypes.CLEAR_CURRENT_RESPONSE })
      
      // Add user message immediately
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      }
      dispatch({ type: actionTypes.ADD_MESSAGE, payload: userMessage })

      let sessionId = state.currentSessionId
      if (!sessionId) {
        sessionId = await createSession()
      }

      if (useStreaming) {
        // Add empty assistant message for streaming
        const assistantMessage = {
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString()
        }
        dispatch({ type: actionTypes.ADD_MESSAGE, payload: assistantMessage })
        dispatch({ type: actionTypes.SET_STREAMING, payload: true })

        let fullResponse = '';

        await chatService.sendMessageStream(
          message,
          sessionId,
          (chunk) => {
            // Update both currentResponse and last message
            dispatch({ type: actionTypes.APPEND_CURRENT_RESPONSE, payload: chunk })
            dispatch({ type: actionTypes.UPDATE_LAST_MESSAGE, payload: chunk })
            fullResponse += chunk;
          },
          (error) => {
            dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
          },
          () => {
            // Process the complete response for code blocks
            processResponseForCode(fullResponse);
            dispatch({ type: actionTypes.SET_STREAMING, payload: false })
            dispatch({ type: actionTypes.CLEAR_CURRENT_RESPONSE })
          }
        )
      } else {
        const response = await chatService.sendMessage(message, sessionId)
        const assistantMessage = {
          role: 'assistant',
          content: response.message,
          timestamp: response.timestamp
        }
        dispatch({ type: actionTypes.ADD_MESSAGE, payload: assistantMessage })
        
        // Process response for code blocks
        processResponseForCode(response.message);
      }

      dispatch({ type: actionTypes.SET_ERROR, payload: null })
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      throw error
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false })
    }
  }

  // Send prompt using the new streaming API with enhanced code detection
  const sendPromptWithStreaming = async (prompt, useMessageHistory = true) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      dispatch({ type: actionTypes.SET_STREAMING, payload: true })
      dispatch({ type: actionTypes.SET_ERROR, payload: null })

      // Prepare message history (exclude current response and empty messages)
      const messageHistory = useMessageHistory 
        ? state.messages.filter(msg => msg.content.trim() !== '')
        : [];

      let fullResponse = '';

      // Create context object for the sendPrompt function
      const context = {
        appendCurrentResponse: (chunk) => {
          dispatch({ type: actionTypes.APPEND_CURRENT_RESPONSE, payload: chunk })
          dispatch({ type: actionTypes.UPDATE_LAST_MESSAGE, payload: chunk })
          fullResponse += chunk;
        },
        clearCurrentResponse: () => {
          dispatch({ type: actionTypes.CLEAR_CURRENT_RESPONSE })
        },
        addMessage: (message) => {
          dispatch({ type: actionTypes.ADD_MESSAGE, payload: message })
        },
        setGeneratedCode: (code) => {
          dispatch({ type: actionTypes.SET_GENERATED_CODE, payload: code })
        },
        setSidebarOpen: (isOpen) => {
          dispatch({ type: actionTypes.SET_SIDEBAR_OPEN, payload: isOpen })
        }
      };

      // Call the sendPrompt function from api.js
      await sendPrompt(prompt, messageHistory, context);

      // Process the complete response for code blocks using our utility
      processResponseForCode(fullResponse);

      dispatch({ type: actionTypes.SET_ERROR, payload: null })
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
      console.error('Error in sendPromptWithStreaming:', error)
      throw error
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false })
      dispatch({ type: actionTypes.SET_STREAMING, payload: false })
      dispatch({ type: actionTypes.CLEAR_CURRENT_RESPONSE })
    }
  }

  // Process any text for code blocks and set as generatedCode
  const extractAndSetCode = (text) => {
    if (!text || typeof text !== 'string') {
      return '';
    }

    const extractedCode = extractCodeBlocks(text);
    
    if (extractedCode) {
      dispatch({ type: actionTypes.SET_GENERATED_CODE, payload: extractedCode });
      dispatch({ type: actionTypes.SET_SIDEBAR_OPEN, payload: true });
      return extractedCode;
    }
    
    return '';
  };

  // Get processed code information from text
  const getCodeInfo = (text) => {
    return processCodeBlocks(text);
  };

  // Check if text has code blocks
  const checkForCode = (text) => {
    return hasCodeBlocks(text);
  };

  // Load messages from a session
  const loadMessages = async (sessionId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      const response = await chatService.getMessages(sessionId)
      dispatch({ type: actionTypes.SET_MESSAGES, payload: response.messages })
      dispatch({ type: actionTypes.SET_SESSION_ID, payload: sessionId })
      
      // Process existing messages for code blocks
      const lastAssistantMessage = response.messages
        .filter(msg => msg.role === 'assistant')
        .pop();
      
      if (lastAssistantMessage) {
        processResponseForCode(lastAssistantMessage.content);
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message })
    } finally {
      dispatch({ type: actionTypes.SET_LOADING, payload: false })
    }
  }

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    dispatch({ type: actionTypes.TOGGLE_SIDEBAR })
  }

  // Set sidebar open state
  const setSidebarOpen = (isOpen) => {
    dispatch({ type: actionTypes.SET_SIDEBAR_OPEN, payload: isOpen })
  }

  const toggleLeftSidebar = () => {
    dispatch({ type: actionTypes.TOGGLE_LEFT_SIDEBAR })
  }

  const setLeftSidebarOpen = (isOpen) => {
    dispatch({ type: actionTypes.SET_LEFT_SIDEBAR_OPEN, payload: isOpen })
  }

  // Set generated code
  const setGeneratedCode = (code) => {
    dispatch({ type: actionTypes.SET_GENERATED_CODE, payload: code })
  }

  // Add to chat history
  const addToChatHistory = (chatSession) => {
    dispatch({ type: actionTypes.ADD_TO_CHAT_HISTORY, payload: chatSession })
  }

  // Load a previous chat session
  const loadChatSession = (chatSession) => {
    dispatch({ type: actionTypes.SET_MESSAGES, payload: chatSession.messages })
    dispatch({ type: actionTypes.SET_SESSION_ID, payload: chatSession.id })
    dispatch({ type: actionTypes.SET_GENERATED_CODE, payload: chatSession.generatedCode || '' })
  }

  // Clear current session
  const clearSession = () => {
    // Save current session to history if it has messages
    if (state.messages.length > 0) {
      const firstUserMessage = state.messages.find(msg => msg.role === 'user')
      const chatSession = {
        id: state.currentSessionId || `session_${Date.now()}`,
        title: firstUserMessage ? 
          firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '') : 
          'New Chat',
        messages: state.messages,
        timestamp: new Date().toISOString(),
        generatedCode: state.generatedCode,
        preview: firstUserMessage ? firstUserMessage.content : ''
      }
      addToChatHistory(chatSession)
    }
    
    dispatch({ type: actionTypes.CLEAR_SESSION })
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: actionTypes.SET_ERROR, payload: null })
  }

  // Add a single message
  const addMessage = (message) => {
    dispatch({ type: actionTypes.ADD_MESSAGE, payload: message })
    
    // If it's an assistant message, check for code blocks
    if (message.role === 'assistant' && message.content) {
      processResponseForCode(message.content);
    }
  }

  // Set current response (for manual streaming control)
  const setCurrentResponse = (response) => {
    dispatch({ type: actionTypes.SET_CURRENT_RESPONSE, payload: response })
  }

  // Append to current response
  const appendCurrentResponse = (chunk) => {
    dispatch({ type: actionTypes.APPEND_CURRENT_RESPONSE, payload: chunk })
  }

  // Clear current response
  const clearCurrentResponse = () => {
    dispatch({ type: actionTypes.CLEAR_CURRENT_RESPONSE })
  }

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    createSession,
    sendMessage,
    sendPromptWithStreaming, // Enhanced streaming method
    loadMessages,
    toggleSidebar,
    setSidebarOpen,
    toggleLeftSidebar,
    setLeftSidebarOpen,
    setGeneratedCode,
    clearSession,
    clearError,
    addMessage,
    setCurrentResponse,
    appendCurrentResponse,
    clearCurrentResponse,
    addToChatHistory,
    loadChatSession,
    
    // Code extraction utilities
    extractAndSetCode, // New: Extract code from text and set as generatedCode
    getCodeInfo, // New: Get full code information from text
    checkForCode, // New: Check if text contains code blocks
    processResponseForCode // New: Process response and auto-set generatedCode
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

// Custom hook to use the ChatContext
export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

// Export the useChat hook for backward compatibility
export const useChat = useChatContext

// Export the context for advanced usage
export { ChatContext } 