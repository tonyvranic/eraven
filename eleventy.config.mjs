import esbuild from 'esbuild';
import pluginWebc from '@11ty/eleventy-plugin-webc';
import { EleventyHtmlBasePlugin } from '@11ty/eleventy';

import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import * as sass from 'sass';

import { writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import path from 'path';
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
    eleventyConfig.addWatchTarget('src/sass/base'); // Watch SCSS folder
    eleventyConfig.addWatchTarget('src/sass/main.scss'); // Watch SCSS folder

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
        generateComponentImports();

        // SCSS -> CSS
        const sassResult = sass.compile('src/sass/main.scss', {
            style: isProd ? 'compressed' : 'expanded', // 'compressed' for production,
            sourceMap: !isProd
        });

        // PostCSS processing (Autoprefixer)
        const postcssResult = await postcss([autoprefixer]).process(
            sassResult.css,
            { from: undefined }
        );

        // Replace "[tag] :scope" with "[tag]"
        let finalCSS = postcssResult.css;
        finalCSS = finalCSS.replace(/(\[[^\]]+\])\s*:scope/g, '$1');

        // Ensure output folder exists
        mkdirSync('public/css', { recursive: true });

        // Write CSS to disk
        writeFileSync('public/css/main.css', finalCSS);

        // Write to sourcemap
        if (sassResult.sourceMap) {
            writeFileSync('public/css/main.css.map', JSON.stringify(sassResult.sourceMap));
        }
    });


    return {
        dir: {
            input: 'src',
            output: 'public'
        }
    }
}


// Helpers
function generateComponentImports() {
    const webcRoot = 'src/webc';
    const outputFile = 'src/sass/components.generated.scss';

    let content = `// AUTO-GENERATED — DO NOT EDIT\n@use "sass:meta";\n\n${''}`;

    function walk(dir) {
        const entries = readdirSync(dir);

        for (const entry of entries) {
            const full = path.join(dir, entry);
            const isDir = statSync(full).isDirectory();

            if (isDir) {
                walk(full);
                continue;
            }

            // Only SCSS files
            if (!entry.endsWith('.scss')) continue;

            const baseName = entry.replace('.scss', '');
            // const dirName = path.basename(path.dirname(full));

            // Component rule:
            //   - folder contains BOTH baseName.webc and baseName.scss
            const webcFile = path.join(path.dirname(full), `${baseName}.webc`);
            const isComponent = existsSync(webcFile);

            if (!isComponent) continue;

            // Output the component scope
            const relative = path
                .relative('src/sass', full)
                .replace(/\\/g, '/');

            content += `[c-${baseName}] {\n    @include meta.load-css('${relative}');\n}\n\n`;
        }
    }

    walk(webcRoot);

    writeFileSync(outputFile, content);
    console.log('Generated:', outputFile);
}