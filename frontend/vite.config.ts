import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Widget library build - optimized for CDN distribution
  if (mode === 'widget') {
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: 'src/widget.tsx',
          name: 'DobLinkWidget',
          fileName: (format) => `dob-link-widget.${format}.js`,
          formats: ['es', 'umd']
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            },
            // Minimize bundle size
            manualChunks: undefined,
            inlineDynamicImports: true
          }
        },
        sourcemap: false, // Disable for production
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        },
        // Optimize for widget size
        target: 'es2015',
        outDir: 'dist/widget'
      },
      define: {
        // Remove development code
        'process.env.NODE_ENV': '"production"'
      }
    };
  }

  // Dashboard build - full application
  if (mode === 'dashboard') {
    return {
      plugins: [react()],
      build: {
        outDir: 'dist/dashboard',
        sourcemap: true,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              ui: ['framer-motion'],
              auth: ['@privy-io/react-auth'],
              web3: ['viem', 'wagmi']
            }
          }
        }
      },
      server: {
        port: 5173,
        host: true
      }
    };
  }

  // Development mode
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
});
