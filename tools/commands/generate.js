import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base project directory
const projectRoot = path.join(__dirname, '..', '..');

export default async function generate(subcommand, args) {
    if (subcommand !== 'component') {
        console.error(`❌ Unknown generate type '${subcommand}'`);
        process.exit(1);
    }

    const name = args[0];

    if (!name) {
        console.error('❌ Usage: er generate component <name>');
        process.exit(1);
    }

    // Support nested paths (test/testing)
    const segments = name.split('/');
    const componentName = segments[segments.length - 1];
    const folder = path.join(projectRoot, 'src/webc', ...segments);

    if (fs.existsSync(folder)) {
        console.error(`❌ Component '${name}' already exists.`);
        process.exit(1);
    }

    fs.mkdirSync(folder, { recursive: true });

    const className = `c-${componentName.toLowerCase()}`;

    // Templates
    const webc = `
<!-- ${componentName} component -->
<div ${className} er-method="${componentName.toLowerCase()}">
    
</div>`.trim();

    const scss = `
:scope {
    
}
    
    `.trim();

    const js = `
export default function init(root) {
    console.log('Init ${componentName}:', root);
}`.trim();

    // Write files
    fs.writeFileSync(path.join(folder, `${componentName}.webc`), webc);
    fs.writeFileSync(path.join(folder, `${componentName}.scss`), scss);
    fs.writeFileSync(path.join(folder, `${componentName}.js`), js);

    console.log(`✔ Component '${name}' created at src/webc/${name}`);
}
