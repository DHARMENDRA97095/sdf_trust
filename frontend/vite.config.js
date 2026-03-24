import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
function isLocalApiUrl(url) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\b/i.test(url);
}

/** Dev proxy target: local XAMPP by default; remote hosts use https (not http) to match production. */
function normalizeProxyApiBase(url) {
  let base = String(url).replace(/\/+$/, "");
  if (base.startsWith("http://") && !isLocalApiUrl(base)) {
    base = "https://" + base.slice("http://".length);
  }
  return base;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = normalizeProxyApiBase(
    env.VITE_API_BASE_URL || "http://localhost/sdftrust/backend/api",
  );
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