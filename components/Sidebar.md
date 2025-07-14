# Sidebar Component

A comprehensive React sidebar component with Monaco Editor for code editing and live preview functionality. Perfect for displaying and editing generated code in an AI coding assistant application.

## Features

- ✅ **Hidden by Default**: Sidebar is hidden initially and opens when `isSidebarOpen` is true
- ✅ **Tab Switcher**: Button group with "Code" and "Preview" tabs
- ✅ **Monaco Editor**: Syntax-highlighted code editing with auto-language detection
- ✅ **Live Preview**: HTML/JS/CSS rendered in a sandboxed iframe
- ✅ **ChatContext Integration**: Connects to ChatContext for code and visibility state
- ✅ **Code Actions**: Copy, download, and run functionality
- ✅ **Multi-language Support**: Auto-detects HTML, JavaScript, Python, C++, Java, and more

## Installation

```bash
npm install @monaco-editor/react
```

## Basic Usage

```jsx
import React from 'react'
import { ChatProvider } from './context/ChatContext'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <ChatProvider>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Your main content */}
        <Box sx={{ flex: 1 }}>
          {/* Main app content */}
        </Box>
        
        {/* Sidebar */}
        <Sidebar />
      </Box>
    </ChatProvider>
  )
}
```

## Props

The Sidebar component doesn't accept props directly but connects to the ChatContext for all its data and state management.

## ChatContext Integration

The Sidebar uses the following ChatContext properties and methods:

### State Properties
- **`isSidebarOpen`**: `boolean` - Controls sidebar visibility
- **`generatedCode`**: `string` - Code content to display/edit

### Methods
- **`toggleSidebar()`**: Toggle sidebar open/closed state
- **`setGeneratedCode(code: string)`**: Update the generated code content

## Features in Detail

### Tab Navigation

The sidebar includes two main tabs:

#### Code Tab
- **Monaco Editor** with syntax highlighting
- **Language auto-detection** (HTML, JavaScript, Python, C++, Java, JSON)
- **Code actions**: Run, Copy, Download
- **Real-time editing** with immediate feedback
- **Dark theme** optimized for code viewing

#### Preview Tab
- **Live iframe** with sandboxed execution
- **Auto-refresh** when code changes
- **Multiple code type support**:
  - Full HTML documents
  - HTML fragments (auto-wrapped)
  - JavaScript code (with console capture)
  - Plain text/other formats

### Language Detection

The sidebar automatically detects code language based on content:

```javascript
const detectLanguage = (code) => {
  if (code.includes('<html') || code.includes('<!DOCTYPE')) return 'html'
  if (code.includes('function') || code.includes('const ')) return 'javascript'
  if (code.includes('def ') || code.includes('import ')) return 'python'
  if (code.includes('#include') || code.includes('int main')) return 'cpp'
  if (code.includes('public class')) return 'java'
  if (code.includes('{') && code.includes(':')) return 'json'
  return 'plaintext'
}
```

### Preview Generation

The preview automatically creates appropriate HTML based on code type:

```javascript
// HTML fragments get wrapped in a complete document
// JavaScript code gets a console output capture
// Full HTML documents are displayed as-is
// Other code types are displayed as formatted text
```

## Code Actions

### Run Code
- Updates the preview with current editor content
- Saves code to ChatContext (`setGeneratedCode`)
- Refreshes iframe content

### Copy Code
- Copies current editor content to clipboard
- Shows temporary success feedback
- Works in all modern browsers

### Download Code
- Downloads code as a `.txt` file
- Uses browser's native download functionality
- Filename: `generated-code.txt`

## Monaco Editor Configuration

The Monaco Editor is configured with:

```javascript
{
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineHeight: 20,
  wordWrap: 'on',
  automaticLayout: true,
  padding: { top: 16, bottom: 16 }
}
```

Custom dark theme:
```javascript
monaco.editor.defineTheme('customDark', {
  base: 'vs-dark',
  inherit: true,
  colors: {
    'editor.background': '#1e1e1e',
    'editor.foreground': '#d4d4d4',
    'editorLineNumber.foreground': '#858585'
  }
})
```

## Iframe Security

The preview iframe includes security features:

```jsx
<iframe
  sandbox="allow-scripts allow-same-origin"
  srcDoc={createPreviewHTML(previewContent)}
  title="Code Preview"
/>
```

**Sandbox permissions:**
- `allow-scripts`: Allows JavaScript execution
- `allow-same-origin`: Allows access to same-origin resources
- No external navigation or form submission allowed

## Responsive Design

The sidebar is designed to work on various screen sizes:

- **Width**: 600px fixed width
- **Height**: Full viewport height
- **Overflow**: Handles long code content with scrolling
- **Layout**: Flexible layout adapts to content

## Integration Examples

### Toggle from Header Button

```jsx
// In Header component
import { useChatContext } from '../context/ChatContext'

const Header = () => {
  const { toggleSidebar, isSidebarOpen } = useChatContext()
  
  return (
    <IconButton onClick={toggleSidebar}>
      <SidebarIcon />
    </IconButton>
  )
}
```

### Set Code from Chat

```jsx
// In chat component
const { setGeneratedCode, toggleSidebar } = useChatContext()

const handleCodeGenerated = (code) => {
  setGeneratedCode(code)
  toggleSidebar() // Open sidebar to show code
}
```

### Load Sample Code

```jsx
// In demo component
const sampleCode = `
function greet(name) {
  return \`Hello, \${name}!\`
}

console.log(greet("World"))
`

const handleLoadSample = () => {
  setGeneratedCode(sampleCode)
  if (!isSidebarOpen) {
    toggleSidebar()
  }
}
```

## Error Handling

The sidebar includes comprehensive error handling:

### Monaco Editor Errors
- Graceful fallback for unsupported languages
- Error boundaries for editor crashes
- Loading state management

### Preview Errors
- JavaScript execution errors are captured
- Invalid HTML is handled gracefully
- Iframe sandbox prevents security issues

### Network Errors
- Monaco Editor CDN fallback
- Offline capability for basic functionality

## Performance Considerations

### Monaco Editor
- **Lazy loading**: Editor loads only when needed
- **Language workers**: Only loads workers for detected languages
- **Memory management**: Proper cleanup on unmount

### Preview Updates
- **Debounced updates**: Prevents excessive iframe refreshes
- **Content caching**: Avoids unnecessary DOM manipulations
- **Efficient rendering**: Uses `srcDoc` for fast updates

## Customization

### Styling

Override default styles using Material UI's `sx` prop or theme:

```jsx
// Custom theme
const theme = createTheme({
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'custom.background'
        }
      }
    }
  }
})
```

### Editor Configuration

Customize Monaco Editor options:

```javascript
<Editor
  options={{
    // Custom options
    fontSize: 16,
    theme: 'vs-light',
    minimap: { enabled: true }
  }}
/>
```

## Browser Support

- **Chrome 90+**: Full support
- **Firefox 88+**: Full support  
- **Safari 14+**: Full support
- **Edge 90+**: Full support

**Required features:**
- ES6+ JavaScript
- CSS Grid/Flexbox
- iframe sandbox
- Clipboard API (for copy functionality)

## Troubleshooting

### Common Issues

1. **Monaco Editor not loading**
   - Check network connectivity
   - Verify CDN access
   - Check browser console for errors

2. **Preview not updating**
   - Ensure code is valid
   - Check iframe sandbox permissions
   - Verify JavaScript execution

3. **Copy functionality not working**
   - Requires HTTPS in production
   - Check clipboard permissions
   - Browser security restrictions

### Debug Mode

Enable debug logging:

```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Sidebar state:', { 
    isSidebarOpen, 
    generatedCode: generatedCode?.length,
    activeTab 
  })
}
```

## API Reference

### Component Structure

```jsx
<Sidebar>
  <Drawer>
    <Toolbar>      // Header with title and close button
    <Tabs>         // Code/Preview tab switcher
    <TabContent>
      {/* Code Tab */}
      <ActionBar>  // Run, Copy, Download buttons
      <Editor>     // Monaco Editor
      
      {/* Preview Tab */}
      <ActionBar>  // Refresh button
      <iframe>     // Live preview
    </TabContent>
  </Drawer>
</Sidebar>
```

### Event Handlers

```javascript
// Tab switching
handleTabChange(event, newValue)

// Code editing
handleEditorChange(value)
handleEditorDidMount(editor, monaco)

// Code actions
handleRunCode()
handleCopyCode()
handleDownloadCode()

// Preview management
createPreviewHTML(code)
```

## License

This component is part of the AI Coding Agent project and is available under the MIT License. 