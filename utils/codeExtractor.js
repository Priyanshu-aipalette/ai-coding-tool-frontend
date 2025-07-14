/**
 * Utility functions for extracting code blocks from LLM responses
 */

/**
 * Extract code blocks from LLM response text
 * @param {string} response - The LLM response text
 * @returns {string} - The extracted code block as a string, or empty string if none found
 */
export const extractCodeBlocks = (response) => {
  if (!response || typeof response !== "string") {
    return "";
  }

  // Pattern to match triple backticks with optional language identifier
  const codeBlockPattern = /```(?:\w+)?\s*\n?([\s\S]*?)```/g;

  // Find all code blocks
  const matches = [];
  let match;

  while ((match = codeBlockPattern.exec(response)) !== null) {
    const codeContent = match[1].trim();
    if (codeContent) {
      matches.push(codeContent);
    }
  }

  // Return the first significant code block (longer than 10 characters)
  const significantBlock = matches.find((block) => block.length > 10);

  // If no significant block found, return the first block or empty string
  return significantBlock || matches[0] || "";
};

/**
 * Extract all code blocks from LLM response text
 * @param {string} response - The LLM response text
 * @returns {Array<string>} - Array of extracted code blocks
 */
export const extractAllCodeBlocks = (response) => {
  if (!response || typeof response !== "string") {
    return [];
  }

  const codeBlockPattern = /```(?:\w+)?\s*\n?([\s\S]*?)```/g;
  const matches = [];
  let match;

  while ((match = codeBlockPattern.exec(response)) !== null) {
    const codeContent = match[1].trim();
    if (codeContent) {
      matches.push(codeContent);
    }
  }

  return matches;
};

/**
 * Extract code blocks with language information
 * @param {string} response - The LLM response text
 * @returns {Array<{code: string, language: string}>} - Array of code blocks with language info
 */
export const extractCodeBlocksWithLanguage = (response) => {
  if (!response || typeof response !== "string") {
    return [];
  }

  const codeBlockPattern = /```(\w+)?\s*\n?([\s\S]*?)```/g;
  const matches = [];
  let match;

  while ((match = codeBlockPattern.exec(response)) !== null) {
    const language = match[1] || "plaintext";
    const codeContent = match[2].trim();

    if (codeContent) {
      matches.push({
        code: codeContent,
        language: language.toLowerCase(),
      });
    }
  }

  return matches;
};

/**
 * Check if response contains code blocks
 * @param {string} response - The LLM response text
 * @returns {boolean} - Whether response contains code blocks
 */
export const hasCodeBlocks = (response) => {
  if (!response || typeof response !== "string") {
    return false;
  }

  return /```[\s\S]*?```/.test(response);
};

/**
 * Extract inline code (single backticks) from response
 * @param {string} response - The LLM response text
 * @returns {Array<string>} - Array of inline code snippets
 */
export const extractInlineCode = (response) => {
  if (!response || typeof response !== "string") {
    return [];
  }

  // Pattern to match single backticks (but not triple backticks)
  const inlineCodePattern = /(?<!`)`([^`\n]+)`(?!`)/g;
  const matches = [];
  let match;

  while ((match = inlineCodePattern.exec(response)) !== null) {
    const codeContent = match[1].trim();
    if (codeContent) {
      matches.push(codeContent);
    }
  }

  return matches;
};

/**
 * Clean and format extracted code
 * @param {string} code - Raw code string
 * @returns {string} - Cleaned code string
 */
export const cleanCode = (code) => {
  if (!code || typeof code !== "string") {
    return "";
  }

  return code
    .trim()
    .replace(/^\n+|\n+$/g, "") // Remove leading/trailing newlines
    .replace(/\t/g, "  "); // Replace tabs with 2 spaces for consistency
};

/**
 * Detect programming language from code content
 * @param {string} code - Code content
 * @returns {string} - Detected language
 */
export const detectLanguage = (code) => {
  if (!code || typeof code !== "string") {
    return "plaintext";
  }

  const lowerCode = code.toLowerCase();

  // HTML
  if (
    lowerCode.includes("<html") ||
    lowerCode.includes("<!doctype") ||
    lowerCode.includes("<div") ||
    lowerCode.includes("<span")
  ) {
    return "html";
  }

  // CSS
  if (
    lowerCode.includes("{") &&
    lowerCode.includes("}") &&
    (lowerCode.includes("color:") ||
      lowerCode.includes("margin:") ||
      lowerCode.includes("padding:"))
  ) {
    return "css";
  }

  // JavaScript/TypeScript
  if (
    lowerCode.includes("function") ||
    lowerCode.includes("const ") ||
    lowerCode.includes("let ") ||
    lowerCode.includes("=>") ||
    lowerCode.includes("console.log")
  ) {
    if (
      lowerCode.includes("interface ") ||
      lowerCode.includes("type ") ||
      lowerCode.includes(": string") ||
      lowerCode.includes(": number")
    ) {
      return "typescript";
    }
    return "javascript";
  }

  // Python
  if (
    lowerCode.includes("def ") ||
    lowerCode.includes("import ") ||
    lowerCode.includes("print(") ||
    lowerCode.includes("if __name__")
  ) {
    return "python";
  }

  // Java
  if (
    lowerCode.includes("public class") ||
    lowerCode.includes("system.out.println") ||
    lowerCode.includes("public static void main")
  ) {
    return "java";
  }

  // C++
  if (
    lowerCode.includes("#include") ||
    lowerCode.includes("int main") ||
    lowerCode.includes("std::") ||
    lowerCode.includes("cout")
  ) {
    return "cpp";
  }

  // JSON
  if (
    (code.trim().startsWith("{") && code.trim().endsWith("}")) ||
    (code.trim().startsWith("[") && code.trim().endsWith("]"))
  ) {
    try {
      JSON.parse(code);
      return "json";
    } catch {
      // Not valid JSON, continue checking
    }
  }

  // SQL
  if (
    lowerCode.includes("select ") ||
    lowerCode.includes("insert ") ||
    lowerCode.includes("update ") ||
    lowerCode.includes("delete ")
  ) {
    return "sql";
  }

  return "plaintext";
};

/**
 * Extract and process code blocks with full metadata
 * @param {string} response - The LLM response text
 * @returns {Object} - Object with processed code information
 */
export const processCodeBlocks = (response) => {
  if (!response || typeof response !== "string") {
    return {
      hasCode: false,
      primaryCode: "",
      language: "plaintext",
      allBlocks: [],
      inlineCode: [],
    };
  }

  const codeBlocks = extractCodeBlocksWithLanguage(response);
  const inlineCode = extractInlineCode(response);
  const primaryCode = extractCodeBlocks(response);

  return {
    hasCode: codeBlocks.length > 0 || inlineCode.length > 0,
    primaryCode: cleanCode(primaryCode),
    language:
      codeBlocks.length > 0
        ? codeBlocks[0].language
        : detectLanguage(primaryCode),
    allBlocks: codeBlocks.map((block) => ({
      ...block,
      code: cleanCode(block.code),
    })),
    inlineCode: inlineCode,
  };
};

export default {
  extractCodeBlocks,
  extractAllCodeBlocks,
  extractCodeBlocksWithLanguage,
  hasCodeBlocks,
  extractInlineCode,
  cleanCode,
  detectLanguage,
  processCodeBlocks,
};
