const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const menuRegex = /\s*<!-- Dropdown Menu -->\s*<nav class="fullscreen-menu" id="fullscreenMenu">[\s\S]*?<\/nav>/;
const match = html.match(menuRegex);
if (match) {
    html = html.replace(match[0], '');
    html = html.replace('</header>', '</header>\n' + match[0]);
    fs.writeFileSync('index.html', html);
    console.log('Moved menu outside navbar');
} else {
    console.log('Menu not found');
}
