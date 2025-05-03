import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Directories to ensure exist
const directories = [
  'public',
  'logs',
  '__tests__/services',
  '__tests__/routes',
  '__tests__/middleware',
  '__tests__/utils'
];

// Create directories if they don't exist
directories.forEach(dir => {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating directory: ${fullPath}`);
    fs.mkdirSync(fullPath, { recursive: true });
  } else {
    console.log(`Directory already exists: ${fullPath}`);
  }
});

console.log('All required directories have been created.');
