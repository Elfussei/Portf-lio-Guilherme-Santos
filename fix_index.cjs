const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const newTop = `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guilherme Santos - Portfólio</title>
    <!-- Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/src/style.css">
</head>
<body>
    <!-- Navbar -->
    <header class="navbar">`;

// Fix the malformed top section
html = html.replace(/<!DOCTYPE html>.*?<header class="navbar">/s, newTop);

// Remove any lingering backslash-n literal strings if they exist
html = html.replace(/\\n/g, '\n');

// Also remove trailing script added by Vite export
html = html.replace(/<script type="module" src="\/src\/main\.ts\?t=\d+"><\/script>/, '');

fs.writeFileSync('index.html', html);
console.log('index.html fixed!');
