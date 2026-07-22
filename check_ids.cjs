const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /<(div|span|img)[^>]*class="[^"]*(avatar|phone-mockup|laptop-mockup|footer-photo|floating-graphic|phone-mockup-comp)[^"]*"[^>]*>/g;
let match;
while ((match = regex.exec(html)) !== null) {
  let idMatch = match[0].match(/id="([^"]*)"/);
  console.log('Element found:', match[0].substring(0, 50) + '...', 'ID:', idMatch ? idMatch[1] : 'NONE');
}
