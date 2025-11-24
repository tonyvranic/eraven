import fg from 'fast-glob';
import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import path from 'path';

const transformAttributesArray = [
    ['layout', 'class'],
]

export default async function initWebcBuild() {
    // Transform webc attributes logic
    const files = await fg('src/webc/**/*.webc');

    for (const file of files) {
        let source = readFileSync(file, 'utf8');
        
        let transformed = transformAttributesInWebc(
            source, transformAttributesArray
        )

        // Generate the output path
        const relative = path.relative('src/webc', file);   // e.g. "header/header.webc"
        const outPath = path.join('public/webc', relative); // "public/webc/header/header.webc"

        console.log(outPath);


        // Ensure directory exists
        mkdirSync(path.dirname(outPath), { recursive: true });

        // Write result
        writeFileSync(outPath, transformed, 'utf8');
    }
}


// Helpers
function transformAttributesInWebc(source, transformPairs) {
    // This regex finds attributes like:
    // layout="foo bar"
    // margin="m-4"
    // layout='hero'
    // margin=btn
    const attrRegex = /([a-zA-Z0-9:_-]+)\s*=\s*(['"])(.*?)\2/g;

    return source.replace(/<([a-zA-Z0-9:_-]+)([^>]*)>/g, (match, tagName, attributes) => {
        let newAttributes = attributes;
        let pendingClasses = [];

        // Collect changes
        attributes.replace(attrRegex, (full, name, quote, value) => {
            const pair = transformPairs.find(([from]) => from === name);
            if (!pair) return;

            const [, toAttr] = pair;

            if (toAttr === 'class') {
                pendingClasses.push(value);
            }

            // remove the original attribute
            newAttributes = newAttributes.replace(full, '');
        });

        // Normalize whitespace
        newAttributes = newAttributes.replace(/\s+/g, ' ').trim();

        if (pendingClasses.length > 0) {
            // Check for existing class=""
            const classMatch = newAttributes.match(/class\s*=\s*(['"])(.*?)\1/);

            if (classMatch) {
                const full = classMatch[0];
                const quote = classMatch[1];
                const existingValue = classMatch[2];

                const mergedValue =
                    existingValue + ' ' + pendingClasses.join(' ');

                const replacement = `class=${quote}${mergedValue}${quote}`;

                newAttributes = newAttributes.replace(full, replacement);
            } else {
                // Add a new class attribute
                newAttributes += ` class="${pendingClasses.join(' ')}"`;
            }
        }

        // Clean spacing
        newAttributes = newAttributes.trim();
        if (newAttributes) newAttributes = ' ' + newAttributes;

        return `<${tagName}${newAttributes}>`;
    });
}