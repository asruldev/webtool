import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively copy directory
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Function to update HTML files to use assets folder instead of _next
function updateHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      updateHtmlFiles(fullPath);
    } else if (entry.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace _next references with assets, handling basePath correctly
      content = content.replace(/\/_next\//g, '/assets/');
      
      fs.writeFileSync(fullPath, content);
      console.log(`Updated: ${fullPath}`);
    }
  }
}

// Main execution
const distDir = path.join(__dirname, '..', 'dist');
const outDir = path.join(__dirname, '..', 'out');

console.log('Copying dist to out for deployment...');

if (fs.existsSync(distDir)) {
  // Copy dist contents to out
  copyDir(distDir, outDir);
  console.log('Dist copied to out successfully');
  
  // Update HTML files if needed
  updateHtmlFiles(outDir);
  console.log('HTML files updated successfully');
} else {
  console.log('dist directory not found, skipping...');
}

console.log('Asset migration completed!'); 