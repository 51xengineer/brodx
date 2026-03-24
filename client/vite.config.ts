import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // allows external access
    port: 5173, // default vite port (keep consistent with ngrok)
    strictPort: true,
    hmr: {
      host: "ae8a-2401-4900-7d81-bd50-3ccb-8044-6cda-4826.ngrok-free.app",
    },
  },
})