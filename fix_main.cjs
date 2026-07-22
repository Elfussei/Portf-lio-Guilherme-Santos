const fs = require('fs');
let code = fs.readFileSync('src/main.ts', 'utf8');

// 1. Wrap Image Editing in localhost condition
code = code.replace(/\/\/ --- Funcionalidade de Edição Visual de Imagens ---/, `// --- Funcionalidade de Edição Visual de Imagens ---\n  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {`);

code = code.replace(/\/\/ --- Funcionalidade de Edição de Links ---/, `}\n\n  // --- Funcionalidade de Edição de Links ---`);

// 2. Fix variable usage
code = code.replace(/const elId = el\.getAttribute\('id'\) \|\| generateId\(el as HTMLElement\);/g, `const elId = el.getAttribute('id');`);

code = code.replace(/el\.setAttribute\('data-img-id', elId\);\s*const savedImg = localStorage\.getItem\(\`img_\$\{elId\}\`\);\n\s*if \(savedImg\) \{\n\s*applyImage\(el as HTMLElement, savedImg\);\n\s*\}/g, `if (elId) { el.setAttribute('data-img-id', elId); const savedImg = localStorage.getItem(\`img_\$\{elId\}\`); if (savedImg) applyImage(el as HTMLElement, savedImg); }`);

code = code.replace(/\/\/ Gera um ID simples e consistente[\s\S]*?function generateId[\s\S]*?return \`\$\{classStr\}-\$\{index\}\`;\n  }/, '');

// 3. Fix export id logic
code = code.replace(/function getExportId[\s\S]*?return \`\$\{classStr\}-\$\{index\}\`;\n        }/, '');
code = code.replace(/let elId = el\.getAttribute\('data-img-id'\) \|\| el\.getAttribute\('id'\);\n            if \(!elId\) \{\n                elId = getExportId\(el as HTMLElement, doc\);\n            \}/, `let elId = el.getAttribute('data-img-id') || el.getAttribute('id');`);

fs.writeFileSync('src/main.ts', code);
console.log('main.ts updated!');
