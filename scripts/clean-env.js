const fs = require('fs');
const content = fs.readFileSync('.env.local', 'utf8');
const cleanContent = content.replace(/\r/g, '').replace(/\n{2,}/g, '\n');
fs.writeFileSync('.env.local', cleanContent, 'utf8');
console.log('Cleaned .env.local');
