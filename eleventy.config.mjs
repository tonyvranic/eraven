import esbuild from 'esbuild';
import pluginWebc from '@11ty/eleventy-plugin-webc';
import { EleventyHtmlBasePlugin } from '@11ty/eleventy';

import { existsSync } from 'fs';

import { config as loadEnv } from 'dotenv';

import initScssBuild from './build/before/scss_before.js';
import initWebcBuild from './build/after/webc_after.js';


// Dot env
const mode = process.env.npm_lifecycle_event === 'build' ? 'prod' : 'dev';
const envFile = `.env.${mode}`;

if (existsSync(envFile)) {
    loadEnv({ path: envFile });
    console.log(`✅ Loaded ${envFile}`);
} else {
    console.warn(`⚠️ No ${envFile} found, falling back to defaults`);
}

const isProd = process.env.NODE_ENV === 'production';


export default function (eleventyConfig) {
    // Plugins
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
    eleventyConfig.addPlugin(pluginWebc, {
        components: 'src/webc/**/*.webc'
    });

    // Copies
    eleventyConfig.addPassthroughCopy('src/assets/'); // Pass assets

    // Watch targets
    eleventyConfig.addWatchTarget('src/webc/'); // Watch WebC folder
    eleventyConfig.addWatchTarget('src/sass/base'); // Watch SCSS folder
    eleventyConfig.addWatchTarget('src/sass/main.scss'); // Watch SCSS folder

    // Server public watch
    eleventyConfig.setServerOptions({
        watch: [
            './public/webc/',
            './public/css/',
            './public/js'
        ],
    });


    // Pipeline
    // - Before compile
    eleventyConfig.on('eleventy.before', async () => {
        // JS bundling
        await esbuild.build({
            entryPoints: {
                main: 'src/main.js',
            },
            bundle: true,
            minify: isProd,
            sourcemap: !isProd,
            splitting: true,
            format: 'esm',
            outdir: 'public/js',
        });

        // SCSS Compilation
        await initScssBuild(isProd);
    });

    // - After compile
    eleventyConfig.on('eleventy.after', async () => {
        // WebC Corrections
        await initWebcBuild();
    })


    return {
        dir: {
            input: 'src',
            output: 'public'
        }
    }
}