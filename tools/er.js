#!/usr/bin/env node
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { existsSync } from 'fs';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CLI arguments
const [,, command, subcommand, ...rest] = process.argv;

// Path to commands folder
const commandsDir = path.join(__dirname, 'commands');

// Validate command
if (!command) {
    console.error('❌ No command provided.');
    process.exit(1);
}

const commandFile = path.join(commandsDir, `${command}.js`);

if (!existsSync(commandFile)) {
    console.error(`❌ Unknown command '${command}'.`);
    process.exit(1);
}

// Convert to proper file:// URL (fixes Windows)
const commandFileUrl = pathToFileURL(commandFile).href;

// Dynamically import the module
const cmd = await import(commandFileUrl);

// Run command
try {
    await cmd.default(subcommand, rest);
} catch (err) {
    console.error('❌ Command failed:', err);
    process.exit(1);
}
