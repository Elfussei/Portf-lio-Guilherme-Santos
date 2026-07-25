const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
console.log('menuToggle count:', (html.match(/id="menuToggle"/g) || []).length);
console.log('fullscreenMenu count:', (html.match(/id="fullscreenMenu"/g) || []).length);
