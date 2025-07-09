const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if out directory exists
const outDir = path.join(__dirname, '..', 'out');
if (!fs.existsSync(outDir)) {
  console.log('❌ out directory not found. Please run "npm run build" first.');
  process.exit(1);
}

// Check if assets directory exists
const assetsDir = path.join(outDir, 'assets');
if (!fs.existsSync(assetsDir)) {
  console.log('❌ assets directory not found. Please run "npm run build" first.');
  process.exit(1);
}

console.log('🚀 Deploying to GitHub Pages...');
try {
  execSync('gh-pages -d out', { stdio: 'inherit' });
  console.log('✅ Deployed successfully!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 