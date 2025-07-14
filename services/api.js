const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1` || "/api/v1";

// Code block detection patterns
const CODE_BLOCK_PATTERNS = [
  /```[\s\S]*?```/g, // Triple backticks
  /`[^`\n]+`/g, // Inline code
  /<code>[\s\S]*?<\/code>/g, // HTML code tags
  /<pre>[\s\S]*?<\/pre>/g, // HTML pre tags
];

// Language detection patterns for code blocks
const LANGUAGE_PATTERNS = {
  javascript: /```(?:js|javascript)\s*([\s\S]*?)```/gi,
  typescript: /```(?:ts|typescript)\s*([\s\S]*?)```/gi,
  html: /```(?:html|htm)\s*([\s\S]*?)```/gi,
  css: /```css\s*([\s\S]*?)```/gi,
  python: /```(?:py|python)\s*([\s\S]*?)```/gi,
  java: /```java\s*([\s\S]*?)```/gi,
  cpp: /```(?:cpp|c\+\+)\s*([\s\S]*?)```/gi,
  json: /```json\s*([\s\S]*?)```/gi,
  xml: /```xml\s*([\s\S]*?)```/gi,
  sql: /```sql\s*([\s\S]*?)```/gi,
  shell: /```(?:bash|sh|shell)\s*([\s\S]*?)```/gi,
  generic: /```(?:\w+)?\s*([\s\S]*?)```/gi,
};

/**
 * Extract code blocks from text content
 * @param {string} text - The text to extract code from
 * @returns {Array} Array of code blocks with language info
 */
const extractCodeBlocks = (text) => {
  const codeBlocks = [];

  // Try to match language-specific patterns first
  for (const [language, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (language === "generic") continue;

    let match;
    while ((match = pattern.exec(text)) !== null) {
      codeBlocks.push({
        language,
        code: match[1].trim(),
        fullMatch: match[0],
      });
    }
  }

  // If no language-specific matches, try generic pattern
  if (codeBlocks.length === 0) {
    let match;
    while ((match = LANGUAGE_PATTERNS.generic.exec(text)) !== null) {
      codeBlocks.push({
        language: "plaintext",
        code: match[1].trim(),
        fullMatch: match[0],
      });
    }
  }

  return codeBlocks;
};

/**
 * Check if text contains code blocks
 * @param {string} text - The text to check
 * @returns {boolean} Whether text contains code blocks
 */
const containsCodeBlocks = (text) => {
  return CODE_BLOCK_PATTERNS.some((pattern) => pattern.test(text));
};

/**
 * Send prompt to FastAPI /stream endpoint with streaming response
 * @param {string} prompt - The user's prompt
 * @param {Array} messageHistory - Array of previous messages
 * @param {Object} context - Chat context with dispatch methods
 * @returns {Promise} Promise that resolves when streaming is complete
 */
export const sendPrompt = async (prompt, messageHistory = [], context) => {
  const {
    appendCurrentResponse,
    clearCurrentResponse,
    addMessage,
    setGeneratedCode,
    setSidebarOpen,
  } = context;

  // Clear any existing response
  clearCurrentResponse();

  // Add user message to context immediately
  const userMessage = {
    role: "user",
    content: prompt,
    timestamp: new Date().toISOString(),
  };
  addMessage(userMessage);

  // Add empty assistant message for streaming
  const assistantMessage = {
    role: "assistant",
    content: "",
    timestamp: new Date().toISOString(),
  };
  addMessage(assistantMessage);

  try {
    // Prepare request body matching FastAPI /stream endpoint format
    const requestBody = {
      messages: messageHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      prompt: prompt,
    };

    // Send request to FastAPI /stream endpoint
    const response = await fetch(`${API_BASE_URL}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response body is available
    if (!response.body) {
      throw new Error("ReadableStream not supported");
    }

    // Create ReadableStream reader
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        // Process each line (Server-Sent Events format)
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.chunk) {
                // Stream individual tokens
                appendCurrentResponse(data.chunk);
                fullResponse += data.chunk;
              } else if (data.error) {
                throw new Error(data.error);
              } else if (data.done) {
                // Streaming complete
                console.log("Streaming complete");

                // Process the full response
                await processCompleteResponse(fullResponse, context);
                return;
              }
            } catch (parseError) {
              console.warn("Failed to parse SSE data:", parseError);
              // Continue processing other lines
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Process the complete response even if done event wasn't received
    if (fullResponse) {
      await processCompleteResponse(fullResponse, context);
    }
  } catch (error) {
    console.error("Error in sendPrompt:", error);

    // Add error message to context
    const errorMessage = {
      role: "assistant",
      content: `Error: ${error.message}`,
      timestamp: new Date().toISOString(),
      isError: true,
    };
    addMessage(errorMessage);

    throw error;
  }
};

/**
 * Process the complete response for code blocks and other content
 * @param {string} fullResponse - The complete response text
 * @param {Object} context - Chat context with dispatch methods
 */
const processCompleteResponse = async (fullResponse, context) => {
  const { setGeneratedCode, setSidebarOpen } = context;

  try {
    // Check for code blocks in the response
    if (containsCodeBlocks(fullResponse)) {
      const codeBlocks = extractCodeBlocks(fullResponse);

      if (codeBlocks.length > 0) {
        // Use the first significant code block
        const primaryCodeBlock =
          codeBlocks.find(
            (block) => block.code.length > 10 && block.language !== "plaintext"
          ) || codeBlocks[0];

        if (primaryCodeBlock) {
          console.log("Generated code detected:", primaryCodeBlock.language);

          // Set the generated code in context
          setGeneratedCode(primaryCodeBlock.code);

          // Auto-open sidebar to show the code
          setSidebarOpen(true);
        }
      }
    }

    // You could add more processing here:
    // - Extract links or images
    // - Parse markdown
    // - Detect specific commands or actions
    // - Save to local storage
  } catch (error) {
    console.error("Error processing complete response:", error);
  }
};

/**
 * Utility function to validate message format
 * @param {Array} messages - Array of messages to validate
 * @returns {boolean} Whether messages are valid
 */
export const validateMessages = (messages) => {
  return (
    Array.isArray(messages) &&
    messages.every(
      (msg) =>
        msg &&
        typeof msg === "object" &&
        typeof msg.role === "string" &&
        typeof msg.content === "string" &&
        ["user", "assistant"].includes(msg.role)
    )
  );
};

/**
 * Utility function to format messages for API
 * @param {Array} messages - Array of messages to format
 * @returns {Array} Formatted messages
 */
export const formatMessagesForAPI = (messages) => {
  if (!validateMessages(messages)) {
    console.warn("Invalid messages format, using empty array");
    return [];
  }

  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
};

/**
 * Test connection to the streaming endpoint
 * @returns {Promise<boolean>} Whether connection is successful
 */
export const testStreamingConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("Streaming connection test failed:", error);
    return false;
  }
};

export default {
  sendPrompt,
  validateMessages,
  formatMessagesForAPI,
  testStreamingConnection,
  extractCodeBlocks,
  containsCodeBlocks,
};
