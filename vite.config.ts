import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
        },
      },
    },
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Disable source maps in production for security
    sourcemap: mode === 'development',
    // Minify the code
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: mode === 'production',
        drop_debugger: true,
      },
      mangle: {
        // Obfuscate variable names
        safari10: true,
      },
      format: {
        // Remove comments
        comments: false,
      },
    },
    // Rollup options for better optimization
    rollupOptions: {
      output: {
        // Manually chunk vendor libraries
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-label', '@radix-ui/react-slot'],
        },
      },
    },
  },
}));
