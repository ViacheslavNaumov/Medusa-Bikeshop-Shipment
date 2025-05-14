import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 12000,
    strictPort: true,
    allowedHosts: [
      'work-1-jafetlshqwpgxbpj.prod-runtime.all-hands.dev',
      'app.all-hands.dev',
      'localhost',
      '0.0.0.0'
    ],
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true
    }
  }
});