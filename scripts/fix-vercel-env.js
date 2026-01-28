const fs = require('fs');
const path = require('path');
const envPath = path.join('.vercel', '.env.production.local');
if (fs.existsSync(envPath)) {
    let content = fs.readFileSync(envPath, 'utf8');
    // Remove \r\n that are inside quotes or at the end of values
    content = content.replace(/\\r\\n/g, '').replace(/\r/g, '');
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('Cleaned ' + envPath);
} else {
    console.log('File not found: ' + envPath);
}
