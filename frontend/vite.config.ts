import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
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
				}
			}
		},
		sourcemap: true,
		minify: 'terser'
	}
});
