import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget.tsx'),
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
    outDir: 'dist'
  },
  define: {
    // Remove development code
    'process.env.NODE_ENV': '"production"'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
