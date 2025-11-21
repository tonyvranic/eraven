import fs from 'fs';
// import path from 'path';

export default async function clean() {
    const folder = 'public';

    if (fs.existsSync(folder)) {
        fs.rmSync(folder, { recursive: true, force: true });
        console.log('✔ Cleaned public folder');
    } else {
        console.log('Nothing to clean.');
    }
}
