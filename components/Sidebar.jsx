import React, { useState, useEffect, useRef } from 'react'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Toolbar,
  Tooltip,
  Button,
  Alert,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Close as CloseIcon,
  Code as CodeIcon,
  Preview as PreviewIcon,
  PlayArrow as RunIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material'
import { Editor } from '@monaco-editor/react'
import { useChatContext } from '../context/ChatContext'

const SIDEBAR_WIDTH = 600

const Sidebar = () => {
  const {
    isSidebarOpen,
    toggleSidebar,
    generatedCode,
    setGeneratedCode
  } = useChatContext()

  const [activeTab, setActiveTab] = useState(0)
  const [localCode, setLocalCode] = useState('')
  const [previewContent, setPreviewContent] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(true) // Read-only by default as requested
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null)
  const iframeRef = useRef(null)
  const editorRef = useRef(null)

  // File extension mappings
  const languageToExtension = {
    'javascript': 'js',
    'html': 'html'
  }

  const downloadFormats = [
    { label: 'HTML (.html)', extension: 'html', mimeType: 'text/html' },
    { label: 'JavaScript (.js)', extension: 'js', mimeType: 'text/javascript' }
  ]

  // Update local code when generated code changes
  useEffect(() => {
    if (generatedCode) {
      setLocalCode(generatedCode)
      setPreviewContent(generatedCode)
      // Auto-detect language when new code is generated
      const detectedLang = detectLanguageFromContent(generatedCode)
      setSelectedLanguage(detectedLang)
    }
  }, [generatedCode])

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Handle code editor change (only when not read-only)
  const handleEditorChange = (value) => {
    if (!isReadOnly) {
      setLocalCode(value || '')
    }
  }

  // Handle language selection change
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value)
  }

  // Toggle read-only mode
  const handleReadOnlyToggle = (event) => {
    setIsReadOnly(event.target.checked)
  }

  // Handle code editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
    // Configure editor theme
    monaco.editor.defineTheme('customDark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585'
      }
    })
    monaco.editor.setTheme('customDark')
  }

  // Run code in preview
  const handleRunCode = () => {
    const detectedLanguage = detectLanguageFromContent(localCode)
    
    // Create preview HTML based on code type
    const previewHTML = createPreviewHTML(localCode, detectedLanguage)
    setPreviewContent(previewHTML)
    setGeneratedCode(localCode)
  }

  // Create HTML for preview based on code type and language
  const createPreviewHTML = (code, language = 'plaintext') => {
    const trimmedCode = code.trim()
    
    if (!trimmedCode) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                background: white;
                text-align: center;
                color: #666;
              }
            </style>
          </head>
          <body>
            <h3>No code to preview</h3>
            <p>Enter some code and click "Refresh Preview" to see the output.</p>
          </body>
        </html>
      `
    }

    // Full HTML document - render as-is
    if (trimmedCode.includes('<html') || trimmedCode.includes('<!DOCTYPE')) {
      return trimmedCode
    }
    
    // HTML fragment - wrap and render
    if (trimmedCode.includes('<') && trimmedCode.includes('>') && (language === 'html' || trimmedCode.match(/<\w+/))) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                background: white;
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            ${trimmedCode}
          </body>
        </html>
      `
    }
    
    
     
     // JavaScript code - show execution output
     if (language === 'javascript' || trimmedCode.includes('function') || trimmedCode.includes('const ') || trimmedCode.includes('let ') || trimmedCode.includes('var ') || trimmedCode.includes('console.')) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                background: white;
              }
              .output-container {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 16px;
                margin: 16px 0;
              }
              .output-title {
                color: #495057;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
              }
              .output-content {
                background: white;
                border: 1px solid #dee2e6;
                border-radius: 4px;
                padding: 12px;
                min-height: 100px;
                white-space: pre-wrap;
                font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.4;
                color: #212529;
              }
              .error {
                color: #dc3545;
                background: #f8d7da;
                border-color: #f5c6cb;
              }
            </style>
          </head>
          <body>
            <h3>📊 JavaScript Execution Output</h3>
            <div class="output-container">
              <div class="output-title">🖥️ Console Output</div>
              <div class="output-content" id="console-output">Running JavaScript code...\n</div>
            </div>
            <div class="output-container" id="dom-container" style="display: none;">
              <div class="output-title">🎨 DOM Output</div>
              <div id="dom-output"></div>
            </div>
            
            <script>
              const consoleOutput = document.getElementById('console-output');
              const domOutput = document.getElementById('dom-output');
              const domContainer = document.getElementById('dom-container');
              
              // Clear output
              consoleOutput.innerHTML = '';
              
              // Capture console methods
              const originalConsole = {
                log: console.log,
                error: console.error,
                warn: console.warn,
                info: console.info
              };
              
              function addToConsole(type, args) {
                const timestamp = new Date().toLocaleTimeString();
                const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : type === 'info' ? 'ℹ️' : '📝';
                const message = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ');
                consoleOutput.innerHTML += \`[\${timestamp}] \${prefix} \${message}\\n\`;
                if (type === 'error') {
                  consoleOutput.classList.add('error');
                }
              }
              
              console.log = (...args) => { addToConsole('log', args); originalConsole.log.apply(console, args); };
              console.error = (...args) => { addToConsole('error', args); originalConsole.error.apply(console, args); };
              console.warn = (...args) => { addToConsole('warn', args); originalConsole.warn.apply(console, args); };
              console.info = (...args) => { addToConsole('info', args); originalConsole.info.apply(console, args); };
              
              // Capture document.write and innerHTML changes
              let domModified = false;
              const originalWrite = document.write;
              document.write = function(content) {
                domOutput.innerHTML += content;
                domContainer.style.display = 'block';
                domModified = true;
              };
              
                             try {
                 addToConsole('info', ['🚀 Starting code execution...']);
                 
                 // Execute user code
                 const result = (function() {
                   ${trimmedCode}
                 })();
                 
                 // If the code returns a value, log it
                 if (result !== undefined) {
                   addToConsole('log', ['Return value:', result]);
                 }
                 
                 // Check if DOM was modified
                 if (!domModified && domOutput.innerHTML.trim() === '') {
                   // Look for any elements created by the code
                   setTimeout(() => {
                     const bodyChildren = Array.from(document.body.children);
                     const codeElements = bodyChildren.filter(el => 
                       !el.classList.contains('output-container') && 
                       el.tagName !== 'H3' && 
                       el.tagName !== 'SCRIPT'
                     );
                     
                     if (codeElements.length > 0) {
                       domContainer.style.display = 'block';
                       domOutput.innerHTML = '<div style="border: 1px dashed #ccc; padding: 10px; background: #fff; margin-bottom: 10px;">Elements created by your code:</div>';
                       codeElements.forEach(el => domOutput.appendChild(el.cloneNode(true)));
                     }
                   }, 100);
                 }
                 
                 // Add completion message if no output
                 setTimeout(() => {
                   if (consoleOutput.innerHTML.includes('Starting code execution...') && 
                       consoleOutput.innerHTML.split('\\n').length <= 2) {
                     addToConsole('info', ['✅ Code executed successfully. No console output generated.']);
                   }
                 }, 200);
                 
               } catch (error) {
                 addToConsole('error', ['💥 Execution Error:', error.name + ':', error.message]);
                 if (error.stack) {
                   addToConsole('error', ['Stack trace:', error.stack.split('\\n')[1] || 'No stack trace available']);
                 }
                 originalConsole.error('Code execution error:', error);
               }
            </script>
          </body>
        </html>
      `
    }
    
    
    
         // Default: show unsupported language message
     return `
       <!DOCTYPE html>
       <html>
         <head>
           <meta charset="utf-8">
           <style>
             body { 
               font-family: Arial, sans-serif; 
               margin: 20px; 
               background: white;
               text-align: center;
               color: #666;
             }
             .info-box {
               background: #e3f2fd;
               border: 1px solid #2196f3;
               border-radius: 8px;
               padding: 20px;
               margin: 20px 0;
             }
             .code-box {
               background: #f8f9fa;
               border: 1px solid #e9ecef;
               border-radius: 8px;
               padding: 16px;
               text-align: left;
               overflow-x: auto;
               margin: 20px 0;
             }
             pre {
               margin: 0;
               font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
               white-space: pre-wrap;
               color: #495057;
               line-height: 1.4;
             }
           </style>
         </head>
         <body>
           <h3>⚠️ Preview Not Supported</h3>
           <div class="info-box">
             <p><strong>This preview only supports HTML and JavaScript code.</strong></p>
             <p>Detected language: <code>${language.toUpperCase()}</code></p>
           </div>
           <div class="code-box">
             <pre>${trimmedCode}</pre>
           </div>
           <div class="info-box">
             <p>💡 <strong>Tip:</strong> Convert your code to HTML or JavaScript to see it run in the preview!</p>
           </div>
         </body>
       </html>
     `
  }

  // Copy code to clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(localCode)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  // Enhanced language detection from content
  const detectLanguageFromContent = (code) => {
    if (!code) return 'plaintext'
    
    const trimmedCode = code.trim()
    
    // HTML detection - prioritize HTML over JavaScript
    if (code.includes('<html') || code.includes('<!DOCTYPE') || 
        code.includes('<div') || code.includes('<span') || 
        code.includes('<h1') || code.includes('<h2') || code.includes('<h3') ||
        code.includes('<p>') || code.includes('<body') || code.includes('<head')) {
      return 'html'
    }
    
    // JavaScript detection
    if (code.includes('function') || code.includes('const ') || code.includes('let ') || 
        code.includes('var ') || code.includes('=>') || code.includes('console.') ||
        code.includes('document.') || code.includes('window.') ||
        trimmedCode.includes('if (') || trimmedCode.includes('for (') || trimmedCode.includes('while (')) {
      return 'javascript'
    }
    
    // Default to plaintext for any other language
    return 'plaintext'
  }

  // Handle download menu
  const handleDownloadClick = (event) => {
    setDownloadAnchorEl(event.currentTarget)
  }

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null)
  }

  // Download code with specific format
  const handleDownloadFormat = (format) => {
    const element = document.createElement('a')
    const file = new Blob([localCode], { type: format.mimeType })
    element.href = URL.createObjectURL(file)
    element.download = `generated-code.${format.extension}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    handleDownloadClose()
  }

  return (
    <Drawer
      anchor="right"
      open={isSidebarOpen}
      onClose={toggleSidebar}
      variant="persistent"
      sx={{
        width: isSidebarOpen ? SIDEBAR_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          borderLeft: '1px solid',
          borderColor: 'divider'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Toolbar sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Code Workspace
          </Typography>
          <Tooltip title="Close Sidebar">
            <IconButton onClick={toggleSidebar} edge="end">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>

        {/* Tab Navigation */}
        <Paper elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab 
              icon={<CodeIcon />} 
              label="Code" 
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
            <Tab 
              icon={<PreviewIcon />} 
              label="Preview" 
              iconPosition="start"
              sx={{ textTransform: 'none' }}
            />
          </Tabs>
        </Paper>

        {/* Content Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Code Tab */}
          {activeTab === 0 && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Code Controls */}
              <Box sx={{ 
                p: 1, 
                borderBottom: '1px solid', 
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                {/* Language and Read-only Controls */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={selectedLanguage}
                      label="Language"
                      onChange={handleLanguageChange}
                    >
                      <MenuItem value="html">HTML</MenuItem>
                      <MenuItem value="javascript">JavaScript</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isReadOnly}
                        onChange={handleReadOnlyToggle}
                        size="small"
                      />
                    }
                    label="Read-only"
                    sx={{ fontSize: '0.875rem' }}
                  />
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    size="small"
                    startIcon={<RunIcon />}
                    variant="contained"
                    onClick={handleRunCode}
                    disabled={!localCode.trim()}
                  >
                    Run
                  </Button>
                  
                  <Button
                    size="small"
                    startIcon={<CopyIcon />}
                    variant="outlined"
                    onClick={handleCopyCode}
                    disabled={!localCode.trim()}
                  >
                    Copy
                  </Button>
                  
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    endIcon={<ExpandMoreIcon />}
                    variant="outlined"
                    onClick={handleDownloadClick}
                    disabled={!localCode.trim()}
                  >
                    Download
                  </Button>

                  {copySuccess && (
                    <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                      Copied!
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Download Menu */}
              <Menu
                anchorEl={downloadAnchorEl}
                open={Boolean(downloadAnchorEl)}
                onClose={handleDownloadClose}
              >
                {downloadFormats.map((format) => (
                  <MenuItem 
                    key={format.extension} 
                    onClick={() => handleDownloadFormat(format)}
                  >
                    {format.label}
                  </MenuItem>
                ))}
              </Menu>

              {/* Monaco Editor */}
              <Box sx={{ flex: 1, minHeight: 0 }}>
                {localCode ? (
                  <Editor
                    height="100%"
                    language={selectedLanguage}
                    value={localCode}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    options={{
                      readOnly: isReadOnly,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineHeight: 20,
                      wordWrap: 'on',
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                      contextmenu: true,
                      selectOnLineNumbers: true,
                      renderLineHighlight: 'all'
                    }}
                  />
                ) : (
                  <Box sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}>
                    <CodeIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" gutterBottom>
                      No Code Generated
                    </Typography>
                    <Typography variant="body2">
                      Generate some code using the AI chat to see it here.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Preview Tab */}
          {activeTab === 1 && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Preview Actions */}
              <Box sx={{ 
                p: 1, 
                borderBottom: '1px solid', 
                borderColor: 'divider',
                display: 'flex',
                gap: 1,
                alignItems: 'center'
              }}>
                <Button
                  size="small"
                  startIcon={<RunIcon />}
                  variant="contained"
                  onClick={handleRunCode}
                  disabled={!localCode.trim()}
                >
                  Refresh Preview
                </Button>
                
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  Live preview of your code
                </Typography>
              </Box>

              {/* Preview Area */}
              <Box sx={{ flex: 1, bgcolor: 'background.default', position: 'relative' }}>
                {previewContent ? (
                  <iframe
                    ref={iframeRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      backgroundColor: 'white'
                    }}
                    srcDoc={previewContent}
                    title="Code Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
                  />
                ) : (
                  <Box sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    color: 'text.secondary',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <PreviewIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" gutterBottom>
                      No Preview Available
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Generate some code and click "Run" to see the preview.
                    </Typography>
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Supports HTML, JavaScript, and other web technologies
                    </Alert>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}

export default Sidebar 