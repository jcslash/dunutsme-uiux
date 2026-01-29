import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      // Allow all hosts for development/testing
      allowedHosts: true,
      // Enable HMR
      hmr: true,
      // Pre-transform dependencies for faster dev startup
      warmup: {
        clientFiles: [
          './index.tsx',
          './App.tsx',
          './components/**/*.tsx',
        ],
      },
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    // Build optimizations
    build: {
      // Enable minification with terser for better compression
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true, // Remove debugger statements
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        mangle: {
          safari10: true, // Safari 10/11 workaround
        },
      },
      // Code splitting configuration
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunk for React core
            'vendor-react': ['react', 'react-dom'],
          },
          // Asset file naming for better caching
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      // Target modern browsers for smaller bundle
      target: 'es2020',
      // Disable source maps in production for smaller bundle
      sourcemap: false,
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      // CSS code splitting
      cssCodeSplit: true,
      // Report compressed size
      reportCompressedSize: true,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    // CSS optimizations
    css: {
      devSourcemap: true,
      modules: {
        localsConvention: 'camelCase',
      },
    },
    // Preview server configuration
    preview: {
      port: 4173,
    },
    // Enable esbuild optimizations
    esbuild: {
      // Remove legal comments
      legalComments: 'none',
      // Target modern JavaScript
      target: 'es2020',
    },
  };
});
