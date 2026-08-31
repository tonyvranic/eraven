// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // SCSS absolute import paths
          loadPaths: [path.resolve(__dirname, 'src/scss')],
        },
      },
    },
  },
});
