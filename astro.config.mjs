// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('astro').SvgOptimizer} */
const whitespaceSvgOptimizer = {
  name: 'whitespace-svg-optimizer',
  // Only strips whitespace between tags; leaves attributes/text content untouched
  optimize: (contents) => contents.replace(/>\s+</g, '><').trim(),
};

// https://astro.build/config
export default defineConfig({
  experimental: {
    svgOptimizer: whitespaceSvgOptimizer,
  },
  build: {
    inlineStylesheets: 'never',
  },
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
