const fs = require('fs');
const path = require('path');

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
const outDir = path.join(__dirname, '..', 'out');
const nextDir = path.join(outDir, '_next');
const assetsDir = path.join(outDir, 'assets');

console.log('Moving assets from _next to assets...');

if (fs.existsSync(nextDir)) {
  // Copy _next contents to assets
  copyDir(nextDir, assetsDir);
  console.log('Assets copied successfully');
  
  // Update HTML files
  updateHtmlFiles(outDir);
  console.log('HTML files updated successfully');
  
  // Remove _next directory
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('Removed _next directory');
} else {
  console.log('_next directory not found, skipping...');
}

console.log('Asset migration completed!'); 