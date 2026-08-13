import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Write 404.html for GitHub Pages SPA routing
    {
      name: 'write-404',
      writeBundle(options) {
        import('fs').then(fs => {
          const outDir = options.dir ?? 'dist';
          const src = path.join(outDir, 'index.html');
          const dest = path.join(outDir, '404.html');
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
          }
        }).catch(() => {});
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
  },
});
