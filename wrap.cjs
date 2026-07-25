const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Undo previous wrapper
if (html.includes('id="main-mobile-wrapper"')) {
    html = html.replace('<body>\\n<div id="main-mobile-wrapper" style="overflow-x: hidden; width: 100%; position: relative; max-width: 100vw;">', '<body>');
    html = html.replace('</div>\\n</body>', '</body>');
    console.log('Removed body wrapper.');
}

// Wrap ONLY <main> so sticky navbar keeps working
if (!html.includes('id="main-content-wrapper"')) {
    html = html.replace('<main>', '<main>\\n<div id="main-content-wrapper" style="overflow-x: hidden; width: 100%; position: relative; max-width: 100vw;">');
    html = html.replace('</main>', '</div>\\n</main>');
    fs.writeFileSync('index.html', html);
    console.log('Successfully wrapped <main> content.');
} else {
    console.log('Main already wrapped.');
}
