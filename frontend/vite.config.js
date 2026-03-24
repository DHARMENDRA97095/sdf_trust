import { API_BASE_URL } from "../config";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// vite.config.js

export const PROJECTS_API = `${API_BASE_URL}`;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/admin': {
        target: `${API_BASE_URL}/backend/admin`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ''),
      },
      // ADD THIS so images show up in your React frontend
      '/uploads': {
        target: `${API_BASE_URL}/admin/uploads`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/uploads/, ''),
      },
    },
  },
})