const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<path d="M3 12H21" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>', '<path class="line-middle" d="M3 12H21" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>');
html = html.replace('<path d="M3 6H21" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>', '<path class="line-top" d="M3 6H21" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>');
html = html.replace('<path d="M3 18H21" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>', '<path class="line-bottom" d="M3 18H21" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>');

fs.writeFileSync('index.html', html);
console.log('Paths updated');
