const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.split('<main>\\n<div').join('<main>\n<div');
html = html.split('</div>\\n</main>').join('</div>\n</main>');
fs.writeFileSync('index.html', html);
console.log('Fixed \\n in index.html');
