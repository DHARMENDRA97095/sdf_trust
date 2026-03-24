import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = (
    env.VITE_API_BASE_URL || "http://localhost/sdftrust/backend/api"
  ).replace(/\/+$/, "");
  const adminBaseUrl = apiBaseUrl.replace(/\/api$/, "/admin");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/admin": {
          target: adminBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/admin/, ""),
        },
        "/uploads": {
          target: `${adminBaseUrl}/uploads`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/uploads/, ""),
        },
      },
    },
  };
});