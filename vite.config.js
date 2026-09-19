import { defineConfig } from 'vite';

// GitHub Pages serves project sites at /<repo-name>/.
// Set REPO_NAME in the workflow; locally it falls back to "/".
export default defineConfig({
  base: process.env.REPO_NAME ? `/${process.env.REPO_NAME}/` : '/',
  build: { outDir: 'dist', assetsDir: 'assets' },
});
