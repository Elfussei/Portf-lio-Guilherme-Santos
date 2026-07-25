const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  '<a href="#" class="text-white editable-link" id="link-linkedin">Guilherme Santos</a>',
  '<a href="https://www.linkedin.com/in/guilherme-santos-695b90133/" target="_blank" class="text-white editable-link" id="link-linkedin">Guilherme Santos</a>'
);

fs.writeFileSync('index.html', html);
console.log('LinkedIn link updated!');
