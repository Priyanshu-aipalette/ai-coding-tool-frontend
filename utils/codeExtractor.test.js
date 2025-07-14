/**
 * Test file for codeExtractor utility functions
 * Run in browser console or with a test runner
 */

import {
  extractCodeBlocks,
  extractAllCodeBlocks,
  hasCodeBlocks,
  processCodeBlocks,
  detectLanguage,
} from "./codeExtractor.js";

// Test data
const testResponses = {
  javascript: `Here's a JavaScript function:

\`\`\`javascript
function addNumbers(a, b) {
  return a + b;
}
\`\`\`

This function adds two numbers.`,

  react: `Here's a React component:

\`\`\`jsx
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  return <div>Count: {count}</div>;
};
\`\`\`

This is a simple counter component.`,

  python: `Here's a Python script:

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

This calculates Fibonacci numbers.`,

  multiple: `Here are multiple code examples:

\`\`\`css
.button {
  background: blue;
  color: white;
}
\`\`\`

And some JavaScript:

\`\`\`javascript
const greeting = "Hello World";
console.log(greeting);
\`\`\`

Finally, some JSON:

\`\`\`json
{
  "name": "test",
  "version": "1.0.0"
}
\`\`\``,

  noCode: "This is just plain text with no code blocks.",

  inlineOnly:
    "This has only inline code like `console.log('hello')` and `const x = 5`.",

  mixed: `This has both inline code \`const x = 5\` and block code:

\`\`\`javascript
function test() {
  return "hello";
}
\`\`\`

And more inline: \`return x + 1\`.`,
};

// Test functions
const runTests = () => {
  console.log("🧪 Running Code Extractor Tests...\n");

  // Test 1: Basic extraction
  console.log("1. Testing basic code extraction...");
  const jsCode = extractCodeBlocks(testResponses.javascript);
  console.log("JavaScript extraction:", jsCode);
  console.log(
    'Expected to contain "function addNumbers":',
    jsCode.includes("function addNumbers")
  );
  console.log("");

  // Test 2: Multiple code blocks
  console.log("2. Testing multiple code blocks...");
  const allBlocks = extractAllCodeBlocks(testResponses.multiple);
  console.log("All blocks count:", allBlocks.length);
  console.log("Expected 3 blocks:", allBlocks.length === 3);
  console.log("All blocks:", allBlocks);
  console.log("");

  // Test 3: Code detection
  console.log("3. Testing code detection...");
  console.log("Has code (JS):", hasCodeBlocks(testResponses.javascript));
  console.log("Has code (no code):", hasCodeBlocks(testResponses.noCode));
  console.log(
    "Has code (inline only):",
    hasCodeBlocks(testResponses.inlineOnly)
  );
  console.log("");

  // Test 4: Language detection
  console.log("4. Testing language detection...");
  const jsCodeOnly = extractCodeBlocks(testResponses.javascript);
  const pyCodeOnly = extractCodeBlocks(testResponses.python);
  console.log("JS code language:", detectLanguage(jsCodeOnly));
  console.log("Python code language:", detectLanguage(pyCodeOnly));
  console.log("");

  // Test 5: Process code blocks (comprehensive)
  console.log("5. Testing processCodeBlocks...");
  const processedJS = processCodeBlocks(testResponses.javascript);
  const processedMultiple = processCodeBlocks(testResponses.multiple);
  const processedMixed = processCodeBlocks(testResponses.mixed);

  console.log("JS processed:", {
    hasCode: processedJS.hasCode,
    language: processedJS.language,
    blocksCount: processedJS.allBlocks.length,
    inlineCount: processedJS.inlineCode.length,
  });

  console.log("Multiple processed:", {
    hasCode: processedMultiple.hasCode,
    language: processedMultiple.language,
    blocksCount: processedMultiple.allBlocks.length,
    inlineCount: processedMultiple.inlineCode.length,
  });

  console.log("Mixed processed:", {
    hasCode: processedMixed.hasCode,
    language: processedMixed.language,
    blocksCount: processedMixed.allBlocks.length,
    inlineCount: processedMixed.inlineCode.length,
  });
  console.log("");

  // Test 6: Edge cases
  console.log("6. Testing edge cases...");
  console.log("Empty string:", extractCodeBlocks(""));
  console.log("Null input:", extractCodeBlocks(null));
  console.log("Undefined input:", extractCodeBlocks(undefined));
  console.log("Non-string input:", extractCodeBlocks(123));
  console.log("");

  // Test 7: Performance test
  console.log("7. Running performance test...");
  const iterations = 1000;
  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    extractCodeBlocks(testResponses.multiple);
    hasCodeBlocks(testResponses.javascript);
    processCodeBlocks(testResponses.mixed);
  }

  const endTime = performance.now();
  const avgTime = (endTime - startTime) / iterations;

  console.log(`Performance (${iterations} iterations):`);
  console.log(`  - Total time: ${(endTime - startTime).toFixed(2)}ms`);
  console.log(`  - Average per iteration: ${avgTime.toFixed(4)}ms`);
  console.log("");

  console.log("✅ All tests completed!");
};

// Validation tests
const validateExtraction = () => {
  console.log("🔍 Running validation tests...\n");

  const tests = [
    {
      name: "JavaScript Function",
      input: testResponses.javascript,
      expectedContains: "function addNumbers",
      expectedLanguage: "javascript",
    },
    {
      name: "React Component",
      input: testResponses.react,
      expectedContains: "useState",
      expectedLanguage: "javascript", // JSX is detected as JavaScript
    },
    {
      name: "Python Script",
      input: testResponses.python,
      expectedContains: "def fibonacci",
      expectedLanguage: "python",
    },
    {
      name: "No Code",
      input: testResponses.noCode,
      expectedContains: null,
      expectedLanguage: "plaintext",
    },
  ];

  tests.forEach((test, index) => {
    console.log(`Test ${index + 1}: ${test.name}`);

    const extracted = extractCodeBlocks(test.input);
    const hasCode = hasCodeBlocks(test.input);
    const info = processCodeBlocks(test.input);

    console.log(`  - Has code: ${hasCode}`);
    console.log(`  - Extracted length: ${extracted.length}`);
    console.log(`  - Detected language: ${info.language}`);

    if (test.expectedContains) {
      const contains = extracted.includes(test.expectedContains);
      console.log(
        `  - Contains "${test.expectedContains}": ${contains ? "✅" : "❌"}`
      );
    } else {
      console.log(`  - No code expected: ${extracted === "" ? "✅" : "❌"}`);
    }

    const languageMatch = info.language === test.expectedLanguage;
    console.log(`  - Language match: ${languageMatch ? "✅" : "❌"}`);
    console.log("");
  });
};

// Export test functions for browser usage
if (typeof window !== "undefined") {
  window.runCodeExtractorTests = runTests;
  window.validateCodeExtraction = validateExtraction;
  window.testCodeExtractorData = testResponses;
}

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    runTests,
    validateExtraction,
    testResponses,
  };
}

export { runTests, validateExtraction, testResponses };
