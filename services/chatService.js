import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

// Configure axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 404) {
      throw new Error("Resource not found");
    } else if (error.response?.status === 500) {
      throw new Error("Server error. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    throw new Error(
      error.response?.data?.detail || error.message || "An error occurred"
    );
  }
);

export const chatService = {
  // Create a new chat session
  async createSession() {
    try {
      const response = await api.post("/sessions");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  },

  // Get session information
  async getSessionInfo(sessionId) {
    try {
      const response = await api.get(`/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get session info: ${error.message}`);
    }
  },

  // Get messages from a session
  async getMessages(sessionId, limit = null) {
    try {
      const params = limit ? { limit } : {};
      const response = await api.get(`/sessions/${sessionId}/messages`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get messages: ${error.message}`);
    }
  },

  // Send a message (non-streaming)
  async sendMessage(message, sessionId = null) {
    try {
      const response = await api.post("/chat", {
        message,
        session_id: sessionId,
        stream: false,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  },

  // Send a message with streaming response
  async sendMessageStream(
    message,
    sessionId = null,
    onChunk,
    onError,
    onComplete
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          session_id: sessionId,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.chunk) {
                  onChunk(data.chunk);
                } else if (data.error) {
                  onError(new Error(data.error));
                  return;
                } else if (data.done) {
                  onComplete();
                  return;
                }
              } catch (parseError) {
                console.warn("Failed to parse SSE data:", parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      onError(error);
    }
  },

  // Delete a session
  async deleteSession(sessionId) {
    try {
      const response = await api.delete(`/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete session: ${error.message}`);
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  },
};

export default chatService;
