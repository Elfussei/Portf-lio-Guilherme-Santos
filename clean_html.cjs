const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const wrapper1 = '<div id="main-mobile-wrapper" style="overflow-x: hidden; width: 100%; position: relative; max-width: 100vw;">';
const wrapper2 = '<div style="overflow-x: hidden; width: 100%; position: relative; max-width: 100vw;">';

// Remove opening wrappers from the top (after body)
html = html.replace(wrapper1 + '\n    ' + wrapper2 + '\n', '');
html = html.replace(wrapper1 + '\r\n    ' + wrapper2 + '\r\n', '');
html = html.replace(wrapper1 + '\n', '');
html = html.replace(wrapper2 + '\n', '');
html = html.replace(wrapper1 + '\r\n', '');
html = html.replace(wrapper2 + '\r\n', '');

// Remove closing wrappers from the bottom (before body)
html = html.replace('    </div>\n</div>\n</body>', '</body>');
html = html.replace('    </div>\r\n</div>\r\n</body>', '</body>');
html = html.replace('</div>\n</body>', '</body>');
html = html.replace('</div>\r\n</body>', '</body>');

// Now ensure we have EXACTLY ONE wrapper around main
if (!html.includes('id="main-content-wrapper"')) {
    html = html.replace('<main>', '<main>\n<div id="main-content-wrapper" style="overflow-x: hidden; width: 100%; position: relative;">');
    html = html.replace('</main>', '</div>\n</main>');
}

fs.writeFileSync('index.html', html);
console.log('Cleaned HTML wrappers');
