import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "127.0.0.1",
    proxy: {
      "/api": {
        target: "https://ai-coding-tool-backend.onrender.com",
        changeOrigin: true,
        secure: true, // since it's HTTPS
      },
    },
  },
});
