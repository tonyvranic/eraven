import esbuild from 'esbuild';
import pluginWebc from '@11ty/eleventy-plugin-webc';
import { EleventyHtmlBasePlugin } from '@11ty/eleventy';

import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import * as sass from 'sass';

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { config as loadEnv } from 'dotenv';


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
    eleventyConfig.addWatchTarget('src/webc/'); // Watch JS folder
    eleventyConfig.addWatchTarget('src/sass/'); // Watch SCSS folder

    // Server public watch
    eleventyConfig.setServerOptions({
        watch: [
            './public/css/',
            './public/js'
        ],
    });


    // Pipeline
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

        // SCSS compilation
        const sassResult = sass.compile('src/sass/imports.scss', {
            style: isProd ? 'compressed' : 'expanded', // 'compressed' for production,
            sourceMap: !isProd
        });

        // PostCSS processing (Autoprefixer)
        const postcssResult = await postcss([autoprefixer]).process(
            sassResult.css,
            { from: undefined }
        );

        // Ensure output folder exists
        mkdirSync('public/css', { recursive: true });

        // Write CSS to disk
        writeFileSync('public/css/imports.css', postcssResult.css);

        if (sassResult.sourceMap) {
            writeFileSync('public/css/imports.css.map', JSON.stringify(sassResult.sourceMap));
        }
    });


    return {
        dir: {
            input: 'src',
            output: 'public'
        }
    }
}