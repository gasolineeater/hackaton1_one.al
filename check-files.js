console.log('Checking project files...');
const fs = require('fs');
const path = require('path');
const requiredFiles = ['package.json', 'vite.config.js', 'index.html', 'src/main.jsx', 'src/App.jsx'];
requiredFiles.forEach(file => {
  const filePath = path.resolve(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} does not exist`);
  }
});
