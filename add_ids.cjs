const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetClasses = ['avatar', 'phone-mockup', 'phone-mockup-small', 'laptop-mockup', 'footer-photo', 'floating-graphic', 'phone-mockup-large', 'phone-mockup-comp', 'editable-image'];
let counters = {};

html = html.replace(/<(div|span|img|a)([^>]+)class="([^"]+)"([^>]*)>/g, (match, tag, attr1, classNames, attr2) => {
  if (attr1.includes('id="') || attr2.includes('id="')) {
    return match; // already has ID
  }
  
  const classes = classNames.split(/\s+/);
  let idToAdd = null;
  
  for (let cls of targetClasses) {
    if (classes.includes(cls)) {
      if (!counters[cls]) counters[cls] = 0;
      idToAdd = `${cls}-${counters[cls]}`;
      counters[cls]++;
      break;
    }
  }
  
  if (idToAdd) {
    return `<${tag} id="${idToAdd}"${attr1}class="${classNames}"${attr2}>`;
  }
  return match;
});

fs.writeFileSync('index.html', html);
console.log('IDs adicionados com sucesso!');
