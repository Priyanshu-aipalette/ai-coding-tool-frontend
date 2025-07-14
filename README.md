# AI Coding Agent - Frontend

A Claude-style AI coding assistant built with React, FastAPI, and Google's Gemini 2.0 Flash API. Features real-time streaming responses, persistent chat history, and an integrated code editor with live preview capabilities.

![AI Coding Agent Demo](https://ai-coding-tool-frontend.netlify.app/)

## 🚀 Live Demo

**[🌐 Try it live here](https://ai-coding-tool-frontend.netlify.app/)

## 📁 Repository Structure

This project is split into two separate repositories:

- **Frontend Repository**: `https://github.com/your-username/ai-coding-agent-frontend` 
- **Backend Repository**: `https://github.com/your-username/ai-coding-agent-backend`

## ✨ Features

- 🤖 **Real-time AI Chat** - Streaming responses using Gemini 2.0 Flash API
- 💬 **Persistent Conversations** - Session-based memory with automatic cleanup
- 📝 **Integrated Code Editor** - Monaco Editor with syntax highlighting
- 🎯 **Live Code Preview** - Execute JavaScript and render HTML in real-time
- 📱 **Modern UI** - Claude-inspired interface with Material-UI components
- 🔄 **Session Management** - Multiple conversation threads with chat history
- 📊 **Code Artifacts** - Generated code appears in a dedicated sidebar
- 🎨 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast Performance** - Optimized streaming and efficient state management

## 🛠️ Technology Stack

### Frontend (This Repository)
- **React 18** - Modern React with hooks and context
- **Material-UI (MUI)** - Beautiful, accessible component library
- **Monaco Editor** - VS Code's editor for code editing
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing

### Backend (Separate Repository)
- **FastAPI** - High-performance Python web framework
- **Google Gemini 2.0 Flash** - Advanced AI language model
- **Server-Sent Events (SSE)** - Real-time streaming responses
- **In-Memory Storage** - Session management with automatic cleanup
- **CORS Middleware** - Cross-origin resource sharing support

## 📦 Setup Instructions

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher) - for backend
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey)) - for backend

### 1. Clone Both Repositories

```bash
# Clone the frontend repository (this repo)
git clone https://github.com/your-username/ai-coding-agent-frontend.git
cd ai-coding-agent-frontend

# In another terminal, clone the backend repository
git clone https://github.com/your-username/ai-coding-agent-backend.git
cd ai-coding-agent-backend
```

### 2. Backend Setup (Required First)

**Important**: You need to set up and run the backend first for the frontend to work properly.

```bash
# Navigate to backend repository
cd ai-coding-agent-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Start the backend server
python main.py
```

The backend will be running at `http://localhost:8000`

### 3. Frontend Setup (This Repository)

```bash
# Navigate to frontend repository (this repo)
cd ai-coding-agent-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at `http://localhost:5173`

### 4. Environment Configuration

#### Backend Repository (.env)
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

#### Frontend Repository (Optional - .env)
```env
# Only needed if backend is deployed to different URL
VITE_API_BASE_URL=https://your-backend-url.com
```

If running locally, the frontend automatically connects to `http://localhost:8000`.

## 🏗️ Architecture & Approach

### Problem-Solving Approach

#### 1. **Separation of Concerns**
- **Frontend Repository**: UI/UX, state management, user interactions
- **Backend Repository**: AI integration, session management, API endpoints
- **Independent Deployment**: Each component can be deployed separately
- **Scalability**: Frontend and backend can scale independently

#### 2. **User Experience First**
- Designed a Claude-like interface for familiarity
- Implemented real-time streaming for responsive interactions
- Created an intuitive sidebar for code artifacts
- Added persistent chat history for context continuity

#### 3. **Streaming Implementation**
```mermaid
graph LR
    A[React Frontend] --> B[FastAPI Backend]
    B --> C[Gemini API]
    C --> D[Streaming Response]
    D --> E[Server-Sent Events]
    E --> F[Frontend Updates]
    F --> G[Real-time UI]
```

- **Challenge**: Make streaming feel natural despite Gemini's chunky responses
- **Solution**: Implemented word-by-word streaming simulation and enhanced UI feedback
- **Result**: Smooth, responsive user experience

#### 4. **State Management Strategy**
- **React Context**: Centralized state management for chat, streaming, and UI
- **Reducer Pattern**: Predictable state updates with clear action types
- **Memory Store**: Backend session management with automatic cleanup
- **Code Extraction**: Intelligent parsing of AI responses for code artifacts

#### 5. **Code Editor Integration**
- **Monaco Editor**: Full VS Code editing experience
- **Language Detection**: Automatic syntax highlighting based on code content
- **Live Preview**: Real-time execution for JavaScript and HTML
- **Download Options**: Export code in various formats

### Key Technical Decisions

#### **Why Separate Repositories?**
- **Independent Deployment**: Deploy frontend and backend separately
- **Team Collaboration**: Different teams can work on each component
- **Technology Flexibility**: Each repo can use different deployment strategies
- **Scaling**: Scale frontend and backend independently based on usage

#### **Why Gemini Over OpenAI?**
- Cost-effective for development and testing
- Excellent code generation capabilities
- Free tier with generous limits
- Google's latest AI technology

#### **Why FastAPI Over Express?**
- Native async support for streaming
- Automatic API documentation
- Type hints for better code quality
- High performance Python framework

#### **Why Material-UI?**
- Comprehensive component library
- Excellent accessibility support
- Consistent design system
- Great TypeScript support

#### **Why Server-Sent Events?**
- Simpler than WebSockets for one-way streaming
- Better browser compatibility
- Automatic reconnection handling
- Lower server resource usage

## 📁 Frontend Project Structure (This Repository)

```
ai-coding-agent-frontend/
├── components/               # Reusable UI components
│   ├── ChatWindow.jsx       # Main chat interface
│   ├── LeftSidebar.jsx      # Navigation and chat history
│   ├── Sidebar.jsx          # Code editor and preview
│   ├── ViewArtifactButton.jsx # Artifact toggle button
│   └── ...
├── context/                 # React Context for state management
│   └── ChatContext.jsx      # Main chat state and actions
├── services/                # API communication
│   ├── api.js              # Core API functions
│   └── chatService.js      # Chat-specific API calls
├── utils/                  # Utility functions
│   └── codeExtractor.js    # Code block parsing
├── pages/                  # Page components
│   └── ChatPage.jsx        # Main chat page
├── examples/               # Component examples
├── src/                    # Entry point
│   ├── App.jsx            # Main App component
│   └── index.jsx          # React DOM entry
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🎯 Key Frontend Features

### Real-Time Streaming UI
- **Server-Sent Events** integration for live response streaming
- **Chunk processing** with enhanced visual feedback
- **Error handling** with graceful fallbacks
- **Connection recovery** for robust operation

### Code Artifact System
- **Automatic detection** of code blocks in AI responses
- **Syntax highlighting** for multiple programming languages
- **Live preview** for HTML and JavaScript execution
- **Download capabilities** in various formats

### Session Management UI
- **Memory-efficient** display with automatic cleanup
- **Conversation persistence** across page reloads
- **Multiple sessions** with easy switching
- **Context preservation** for coherent conversations

### Modern UI/UX
- **Claude-inspired design** for familiar user experience
- **Responsive layout** that works on all devices
- **Smooth animations** and transitions
- **Accessibility features** throughout the interface

## 🚀 Deployment

### Frontend Deployment (Vercel - Recommended)

1. **Connect this repository** to Vercel
2. **Configure build settings**:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
3. **Set environment variables** (if backend is deployed):
   ```
   VITE_API_BASE_URL=https://your-backend-url.com
   ```
4. **Deploy** - Vercel will automatically deploy on every push to main

### Backend Deployment

For backend deployment instructions, see the [backend repository](https://github.com/your-username/ai-coding-agent-backend).

**Important**: Deploy the backend first, then update the frontend's `VITE_API_BASE_URL` environment variable to point to your deployed backend URL.

### Complete Deployment Flow

1. **Deploy Backend**:
   - Deploy the backend repository to Render/Railway/Heroku
   - Note the deployed backend URL (e.g., `https://your-app.onrender.com`)

2. **Deploy Frontend**:
   - Set `VITE_API_BASE_URL=https://your-app.onrender.com` in Vercel
   - Deploy this repository to Vercel

3. **Test Integration**:
   - Verify frontend can communicate with deployed backend
   - Test streaming functionality end-to-end

## 🧪 Testing

### Frontend Tests
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Manual Testing
1. **Ensure backend is running** (locally or deployed)
2. **Start frontend**: `npm run dev`
3. **Open browser**: Navigate to `http://localhost:5173`
4. **Send a message**: Try "Write a hello world in Python"
5. **Verify streaming**: Response should appear in real-time
6. **Check code artifacts**: Code should appear in sidebar
7. **Test code execution**: Verify preview panel works

## 📈 Frontend Performance Optimizations

- **Code splitting** with React.lazy for Monaco Editor
- **Optimized bundle** with Vite's tree shaking
- **Efficient re-renders** with React.memo and useMemo
- **Streaming UI updates** for immediate user feedback
- **Lazy loading** of heavy components

## 🔗 Related Repositories

- **Backend Repository**: [ai-coding-agent-backend](https://github.com/Priyanshu-aipalette/ai-coding-tool-frontend/)
- **Documentation**: Check both repositories for complete setup instructions

## 🤝 Contributing

1. **Fork this repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

For backend contributions, see the [backend repository](https://github.com/your-username/ai-coding-agent-backend).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for the powerful AI capabilities
- **Material-UI** for the beautiful component library
- **Monaco Editor** for the VS Code editing experience
- **Vite** for the excellent build tool
- **Claude AI** for the UI/UX inspiration

## 📞 Support

If you have any questions or need help:

- **Frontend Issues**: Create an issue in this repository
- **Backend Issues**: Create an issue in the [backend repository](https://github.com/your-username/ai-coding-agent-backend)
- **Integration Issues**: Check both repositories' documentation

---

**Built with ❤️ using React, Vite, and Material-UI**

**Backend**: See [ai-coding-agent-backend](https://github.com/your-username/ai-coding-agent-backend) for FastAPI + Gemini implementation 