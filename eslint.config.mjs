import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin'

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
        },
        
        extends: ['js/recommended'],
        languageOptions: { globals: globals.browser } },
]);
