import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The backend CORS config allows http://localhost:5173, so the dev server must keep that port.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
})
