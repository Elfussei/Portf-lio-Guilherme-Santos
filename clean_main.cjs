const fs = require('fs');
let code = fs.readFileSync('src/main.ts', 'utf8');

// 1. fileInput declaration
code = code.replace(
  /  \/\/ Criar um input de ficheiro oculto\n  const fileInput = document\.createElement\('input'\);\n  fileInput\.type = 'file';\n  fileInput\.accept = 'image\/\*';\n  fileInput\.style\.display = 'none';\n  document\.body\.appendChild\(fileInput\);\n\n  let currentEditingElement: HTMLElement \| null = null;/,
  `  // Variables para Edição Visual\n  let fileInput: HTMLInputElement | null = null;\n  let currentEditingElement: HTMLElement | null = null;\n  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';\n\n  if (isLocalhost) {\n    fileInput = document.createElement('input');\n    fileInput.type = 'file';\n    fileInput.accept = 'image/*';\n    fileInput.style.display = 'none';\n    document.body.appendChild(fileInput);\n  }`
);

// 2. Cursor and pointer
code = code.replace(
  /    \(el as HTMLElement\)\.style\.cursor = 'pointer';\n    \(el as HTMLElement\)\.title = 'Clique para alterar a imagem';/,
  `    if (isLocalhost) {\n      (el as HTMLElement).style.cursor = 'pointer';\n      (el as HTMLElement).title = 'Clique para alterar a imagem';\n    }`
);

// 3. Static IDs instead of generateId
code = code.replace(
  /    \/\/ Tentar carregar imagem do localStorage caso exista\n    const elId = el\.getAttribute\('id'\) \|\| generateId\(el as HTMLElement\);\n    el\.setAttribute\('data-img-id', elId\);\n    \n    const savedImg = localStorage\.getItem\(\`img_\$\{elId\}\`\);\n    if \(savedImg\) \{\n      applyImage\(el as HTMLElement, savedImg\);\n    \}/,
  `    const elId = el.getAttribute('id');\n    if (elId) {\n      el.setAttribute('data-img-id', elId);\n      const savedImg = localStorage.getItem(\`img_\$\{elId\}\`);\n      if (savedImg) {\n        applyImage(el as HTMLElement, savedImg);\n      }\n    }`
);

// 4. File input listener check
code = code.replace(
  /  fileInput\.addEventListener\('change', \(e\) => \{/,
  `  if (fileInput) {\n  fileInput.addEventListener('change', (e) => {`
);
code = code.replace(
  /    fileInput\.value = '';\n  \}\);/,
  `    fileInput!.value = '';\n  });\n  }`
);

// 5. Static click listener
code = code.replace(
  /    el\.addEventListener\('click', \(e\) => \{\n      e\.preventDefault\(\);\n      currentEditingElement = el as HTMLElement;\n      fileInput\.click\(\);\n    \}\);/,
  `    el.addEventListener('click', (e) => {\n      e.preventDefault();\n      if (!isLocalhost || !fileInput) return;\n      currentEditingElement = el as HTMLElement;\n      fileInput.click();\n    });`
);

// 6. Dynamic click listener
code = code.replace(
  /      el\.addEventListener\('click', \(e\) => \{\n        e\.preventDefault\(\);\n        currentEditingElement = el as HTMLElement;\n        fileInput\.click\(\);\n      \}\);/,
  `      el.addEventListener('click', (e) => {\n        e.preventDefault();\n        if (!isLocalhost || !fileInput) return;\n        currentEditingElement = el as HTMLElement;\n        fileInput.click();\n      });`
);

// 7. Remove generateId
code = code.replace(
  /  \/\/ Gera um ID simples e consistente para o elemento com base nas suas classes e índice\n  function generateId\(el: HTMLElement\): string \{\n    const classStr = el\.className\.replace\(\/\\s\+\/g, '-'\);\n    const allSimilar = document\.querySelectorAll\(\`\.\$\{classStr\.split\('-'\)\[0\]\}\`\);\n    let index = 0;\n    allSimilar\.forEach\(\(similar, i\) => \{\n      if \(similar === el\) index = i;\n    \}\);\n    return \`\$\{classStr\}-\$\{index\}\`;\n  \}/,
  ``
);

// 8. Remove getExportId
code = code.replace(
  /        function getExportId\(el: HTMLElement, docCtx: Document\) \{\n            const classStr = el\.className\.replace\(\/\\\\s\+\/g, '-'\);\n            const allSimilar = docCtx\.querySelectorAll\(\`\.\$\{classStr\.split\('-'\)\[0\]\}\`\);\n            let index = 0;\n            allSimilar\.forEach\(\(similar, i\) => \{\n                if \(similar === el\) index = i;\n            \}\);\n            return \`\$\{classStr\}-\$\{index\}\`;\n        \}/,
  ``
);

code = code.replace(
  /            if \(!elId\) \{\n                elId = getExportId\(el as HTMLElement, doc\);\n            \}/,
  ``
);

fs.writeFileSync('src/main.ts', code);
console.log('clean_main.js executado com sucesso!');
