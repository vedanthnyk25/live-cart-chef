import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';  

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    host: true, // accessible from network
    watch: {
      usePolling: true,
      interval: 100, // check for changes every 100ms
    },
  },
});
