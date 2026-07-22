const fs = require('fs');
let code = fs.readFileSync('src/main.ts', 'utf8');

code = code.replace(/const fileInput = document\.createElement\('input'\);/, `let fileInput: HTMLInputElement;\n    let currentEditingElement: HTMLElement | null = null;\n    const fileInputObj = document.createElement('input');\n    fileInput = fileInputObj;`);

code = code.replace(/let currentEditingElement: HTMLElement \| null = null;/, '');

code = code.replace(/el\.addEventListener\('click', \(e\) => \{/, `if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {\n        el.addEventListener('click', (e) => {`);

code = code.replace(/fileInput\.click\(\);\n\s*\}\);\n\s*\}\);/, `fileInput.click();\n        });\n      }\n    });`);

fs.writeFileSync('src/main.ts', code);
console.log('Scopes fixed!');
