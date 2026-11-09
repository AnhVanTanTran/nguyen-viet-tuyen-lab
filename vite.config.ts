import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Relative base + hash routes: the site works at any GitHub Pages path,
// whatever the repository is called, with no extra configuration.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
