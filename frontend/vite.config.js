import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Позволяет доступ извне
    port: 5173 // Убедитесь, что порт совпадает с тем, который вы используете в Docker
  }
})

