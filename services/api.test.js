/**
 * Test file for the sendPrompt API function
 * Run this in a browser console or with a test runner
 */

import {
  sendPrompt,
  validateMessages,
  formatMessagesForAPI,
  extractCodeBlocks,
  containsCodeBlocks,
} from "./api.js";

// Test data
const testMessages = [
  { role: "user", content: "Hello, can you help me with JavaScript?" },
  {
    role: "assistant",
    content: "Of course! I'd be happy to help you with JavaScript.",
  },
  { role: "user", content: "Create a function to add two numbers" },
];

const testCodeResponse = `
Here's a JavaScript function to add two numbers:

\`\`\`javascript
function addNumbers(a, b) {
  return a + b;
}

// Example usage
console.log(addNumbers(5, 3)); // Output: 8
\`\`\`

You can also use an arrow function:

\`\`\`javascript
const addNumbers = (a, b) => a + b;
\`\`\`

This function takes two parameters and returns their sum.
`;

const testHTMLResponse = `
Here's a simple HTML contact form:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Contact Form</title>
</head>
<body>
    <form>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        
        <button type="submit">Submit</button>
    </form>
</body>
</html>
\`\`\`
`;

// Test functions
const runTests = () => {
  console.log("🧪 Starting API Tests...\n");

  // Test 1: Message validation
  console.log("1. Testing message validation...");
  console.log("Valid messages:", validateMessages(testMessages));
  console.log("Invalid messages:", validateMessages([{ role: "invalid" }]));
  console.log("Empty array:", validateMessages([]));
  console.log("");

  // Test 2: Message formatting
  console.log("2. Testing message formatting...");
  const formattedMessages = formatMessagesForAPI(testMessages);
  console.log("Formatted messages:", formattedMessages);
  console.log("");

  // Test 3: Code block detection
  console.log("3. Testing code block detection...");
  console.log(
    "Contains code blocks (JS):",
    containsCodeBlocks(testCodeResponse)
  );
  console.log(
    "Contains code blocks (HTML):",
    containsCodeBlocks(testHTMLResponse)
  );
  console.log(
    "Contains code blocks (plain text):",
    containsCodeBlocks("This is just plain text")
  );
  console.log("");

  // Test 4: Code block extraction
  console.log("4. Testing code block extraction...");
  const jsCodeBlocks = extractCodeBlocks(testCodeResponse);
  console.log("JavaScript code blocks:", jsCodeBlocks);

  const htmlCodeBlocks = extractCodeBlocks(testHTMLResponse);
  console.log("HTML code blocks:", htmlCodeBlocks);
  console.log("");

  // Test 5: Mock sendPrompt function
  console.log("5. Testing sendPrompt function (mock)...");
  testSendPromptMock();
  console.log("");

  console.log("✅ All tests completed!");
};

// Mock test for sendPrompt function
const testSendPromptMock = () => {
  const mockContext = {
    appendCurrentResponse: (chunk) => {
      console.log("📨 Received chunk:", chunk);
    },
    clearCurrentResponse: () => {
      console.log("🧹 Clearing current response");
    },
    addMessage: (message) => {
      console.log("💬 Adding message:", message);
    },
    setGeneratedCode: (code) => {
      console.log("🔧 Generated code detected:", code);
    },
    setSidebarOpen: (isOpen) => {
      console.log("📋 Setting sidebar open:", isOpen);
    },
  };

  console.log("Mock context created successfully");
  console.log("Context methods:", Object.keys(mockContext));
};

// Test connection to backend
const testConnection = async () => {
  console.log("🔗 Testing connection to backend...");

  try {
    const response = await fetch("/api/v1/health");
    if (response.ok) {
      console.log("✅ Backend connection successful");
      return true;
    } else {
      console.log("❌ Backend connection failed:", response.status);
      return false;
    }
  } catch (error) {
    console.log("❌ Backend connection error:", error.message);
    return false;
  }
};

// Integration test with real backend (if available)
const testRealSendPrompt = async () => {
  console.log("🚀 Testing real sendPrompt function...");

  // Check if backend is available
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log("⚠️  Backend not available, skipping real test");
    return;
  }

  const testPrompt =
    'Create a simple JavaScript function that returns "Hello, World!"';
  const testContext = {
    responses: [],
    messages: [],
    generatedCode: null,
    appendCurrentResponse: function (chunk) {
      this.responses.push(chunk);
      console.log("📨 Chunk received:", chunk);
    },
    clearCurrentResponse: function () {
      this.responses = [];
      console.log("🧹 Responses cleared");
    },
    addMessage: function (message) {
      this.messages.push(message);
      console.log("💬 Message added:", message);
    },
    setGeneratedCode: function (code) {
      this.generatedCode = code;
      console.log("🔧 Code generated:", code);
    },
    setSidebarOpen: function (isOpen) {
      console.log("📋 Sidebar open:", isOpen);
    },
  };

  try {
    await sendPrompt(testPrompt, [], testContext);
    console.log("✅ Real sendPrompt test completed");
    console.log("Total chunks received:", testContext.responses.length);
    console.log("Messages created:", testContext.messages.length);
    console.log("Generated code:", testContext.generatedCode ? "Yes" : "No");
  } catch (error) {
    console.log("❌ Real sendPrompt test failed:", error.message);
  }
};

// Performance test
const testPerformance = () => {
  console.log("⚡ Running performance tests...");

  const iterations = 1000;
  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    validateMessages(testMessages);
    formatMessagesForAPI(testMessages);
    containsCodeBlocks(testCodeResponse);
    extractCodeBlocks(testCodeResponse);
  }

  const endTime = performance.now();
  const avgTime = (endTime - startTime) / iterations;

  console.log(`📊 Performance results:`);
  console.log(`  - ${iterations} iterations completed`);
  console.log(`  - Total time: ${(endTime - startTime).toFixed(2)}ms`);
  console.log(`  - Average time per iteration: ${avgTime.toFixed(4)}ms`);
};

// Export test functions for use in browser console
if (typeof window !== "undefined") {
  window.runAPITests = runTests;
  window.testRealSendPrompt = testRealSendPrompt;
  window.testPerformance = testPerformance;
}

// Run tests if in Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    runTests,
    testRealSendPrompt,
    testPerformance,
  };
}

export { runTests, testRealSendPrompt, testPerformance };
