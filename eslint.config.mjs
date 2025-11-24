import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
    { 
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {
            js,
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/indent': ['error', 4],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
        },
        
        extends: ['js/recommended'],
        languageOptions: { globals: globals.browser }
    },
    {
        files: ['tools/**/*.js', 'eleventy.config.mjs'],
        languageOptions: {
            env: {
                node: true
            }
        }
    }
]);
