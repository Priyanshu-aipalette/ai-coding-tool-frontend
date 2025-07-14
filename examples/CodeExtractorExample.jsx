import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material'
import { useChatContext } from '../context/ChatContext'
import { 
  extractCodeBlocks, 
  extractAllCodeBlocks, 
  extractCodeBlocksWithLanguage,
  hasCodeBlocks,
  processCodeBlocks,
  detectLanguage,
  cleanCode
} from '../utils/codeExtractor'

const CodeExtractorExample = () => {
  const [inputText, setInputText] = useState('')
  const [extractedCode, setExtractedCode] = useState('')
  const [codeInfo, setCodeInfo] = useState(null)
  
  const {
    extractAndSetCode,
    getCodeInfo,
    checkForCode,
    generatedCode,
    isSidebarOpen
  } = useChatContext()

  // Sample LLM responses for testing
  const sampleResponses = [
    {
      title: "JavaScript Function",
      content: `Here's a JavaScript function to add two numbers:

\`\`\`javascript
function addNumbers(a, b) {
  return a + b;
}

// Example usage
console.log(addNumbers(5, 3)); // Output: 8
\`\`\`

This function takes two parameters and returns their sum.`
    },
    {
      title: "React Component",
      content: `Here's a simple React component:

\`\`\`jsx
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};

export default Counter;
\`\`\`

This component manages a counter state.`
    },
    {
      title: "Python Script",
      content: `Here's a Python script to calculate Fibonacci numbers:

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Calculate first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
\`\`\`

This uses recursion to calculate Fibonacci numbers.`
    },
    {
      title: "HTML Form",
      content: `Here's an HTML contact form:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Contact Form</title>
    <style>
        .form-group { margin: 10px 0; }
        input, textarea { width: 100%; padding: 8px; }
    </style>
</head>
<body>
    <form>
        <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        </div>
        <button type="submit">Submit</button>
    </form>
</body>
</html>
\`\`\`

This creates a responsive contact form.`
    },
    {
      title: "Mixed Code",
      content: `Here are multiple code examples:

First, a CSS snippet:
\`\`\`css
.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}
\`\`\`

And some inline code: \`const greeting = "Hello World"\`

Finally, a JSON configuration:
\`\`\`json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "test": "jest"
  }
}
\`\`\`

These examples show different code types.`
    }
  ]

  // Handle manual text extraction
  const handleExtractCode = () => {
    if (!inputText.trim()) return
    
    // Extract using utility function
    const code = extractCodeBlocks(inputText)
    setExtractedCode(code)
    
    // Get full code information
    const info = processCodeBlocks(inputText)
    setCodeInfo(info)
  }

  // Handle extraction and set in context
  const handleExtractAndSetInContext = () => {
    if (!inputText.trim()) return
    
    const code = extractAndSetCode(inputText)
    setExtractedCode(code)
    
    const info = getCodeInfo(inputText)
    setCodeInfo(info)
  }

  // Load sample response
  const loadSample = (sample) => {
    setInputText(sample.content)
    setExtractedCode('')
    setCodeInfo(null)
  }

  // Test all extraction functions
  const testAllFunctions = () => {
    if (!inputText.trim()) return

    console.log('=== Code Extraction Test Results ===')
    console.log('Input text:', inputText.substring(0, 100) + '...')
    console.log('')
    
    console.log('1. hasCodeBlocks:', hasCodeBlocks(inputText))
    console.log('2. extractCodeBlocks:', extractCodeBlocks(inputText))
    console.log('3. extractAllCodeBlocks:', extractAllCodeBlocks(inputText))
    console.log('4. extractCodeBlocksWithLanguage:', extractCodeBlocksWithLanguage(inputText))
    console.log('5. processCodeBlocks:', processCodeBlocks(inputText))
    console.log('6. detectLanguage of primary code:', detectLanguage(extractCodeBlocks(inputText)))
    console.log('7. cleanCode result:', cleanCode(extractCodeBlocks(inputText)))
    console.log('')
    console.log('=== Context Methods ===')
    console.log('8. checkForCode:', checkForCode(inputText))
    console.log('9. getCodeInfo:', getCodeInfo(inputText))
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Code Extractor Utility Example
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        This example demonstrates the `extractCodeBlocks` utility function that extracts code
        from LLM responses and automatically sets it as `generatedCode` in ChatContext.
      </Typography>

      {/* Sample Responses */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sample LLM Responses
        </Typography>
        <Grid container spacing={2}>
          {sampleResponses.map((sample, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    {sample.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {sample.content.substring(0, 80)}...
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => loadSample(sample)}>
                    Load Sample
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Input Area */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Input Text
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={8}
          label="Enter LLM response with code blocks"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste an LLM response that contains code blocks wrapped in triple backticks..."
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={handleExtractCode}
            disabled={!inputText.trim()}
          >
            Extract Code (Utility Only)
          </Button>
          
          <Button
            variant="contained"
            color="secondary"
            onClick={handleExtractAndSetInContext}
            disabled={!inputText.trim()}
          >
            Extract & Set in Context
          </Button>
          
          <Button
            variant="outlined"
            onClick={testAllFunctions}
            disabled={!inputText.trim()}
          >
            Test All Functions (Console)
          </Button>
        </Box>
      </Paper>

      {/* Results */}
      {(extractedCode || codeInfo) && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Extraction Results
          </Typography>
          
          {/* Primary Extracted Code */}
          {extractedCode && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Primary Code Block:
              </Typography>
              <Paper sx={{ 
                p: 2, 
                bgcolor: 'grey.50', 
                fontFamily: 'monospace',
                maxHeight: 300,
                overflow: 'auto'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {extractedCode}
                </pre>
              </Paper>
            </Box>
          )}

          {/* Code Information */}
          {codeInfo && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Code Analysis:
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Has Code: ${codeInfo.hasCode ? 'Yes' : 'No'}`}
                  color={codeInfo.hasCode ? 'success' : 'default'}
                  size="small"
                />
                <Chip 
                  label={`Language: ${codeInfo.language}`}
                  color="primary"
                  size="small"
                />
                <Chip 
                  label={`Code Blocks: ${codeInfo.allBlocks.length}`}
                  color="info"
                  size="small"
                />
                <Chip 
                  label={`Inline Code: ${codeInfo.inlineCode.length}`}
                  color="secondary"
                  size="small"
                />
              </Box>

              {/* All Code Blocks */}
              {codeInfo.allBlocks.length > 0 && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    All Code Blocks:
                  </Typography>
                  {codeInfo.allBlocks.map((block, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Block {index + 1} ({block.language}):
                      </Typography>
                      <Paper sx={{ 
                        p: 1, 
                        bgcolor: 'grey.100', 
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        maxHeight: 150,
                        overflow: 'auto'
                      }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          {block.code}
                        </pre>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Inline Code */}
              {codeInfo.inlineCode.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Inline Code Snippets:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {codeInfo.inlineCode.map((code, index) => (
                      <Chip 
                        key={index}
                        label={code}
                        variant="outlined"
                        size="small"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      )}

      {/* Context Status */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          ChatContext Status
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`Generated Code: ${generatedCode ? 'Set' : 'Not Set'}`}
            color={generatedCode ? 'success' : 'default'}
            size="small"
          />
          <Chip 
            label={`Sidebar: ${isSidebarOpen ? 'Open' : 'Closed'}`}
            color={isSidebarOpen ? 'info' : 'default'}
            size="small"
          />
        </Box>

        {generatedCode && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Current Generated Code in Context:
            </Typography>
            <Paper sx={{ 
              p: 2, 
              bgcolor: 'grey.50', 
              fontFamily: 'monospace',
              maxHeight: 200,
              overflow: 'auto'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {generatedCode}
              </pre>
            </Paper>
          </Box>
        )}
      </Paper>

      {/* API Documentation */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Utility Functions Reference
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="primary">
              extractCodeBlocks(response: string): string
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Extracts the first significant code block from response text and returns it as a string.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="primary">
              extractAllCodeBlocks(response: string): Array&lt;string&gt;
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Extracts all code blocks from response text and returns them as an array of strings.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="primary">
              hasCodeBlocks(response: string): boolean
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Checks if the response contains any code blocks wrapped in triple backticks.
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="primary">
              processCodeBlocks(response: string): Object
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Processes response and returns detailed information about all code blocks, language detection, and inline code.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              ChatContext Integration
            </Typography>
            
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" color="secondary">
                extractAndSetCode(text: string): string
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Extracts code from text, sets it as generatedCode in context, and auto-opens sidebar.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default CodeExtractorExample 