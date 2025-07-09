const fs = require('fs');
const path = require('path');

// Function to extract asset URLs from HTML content
function extractAssetUrls(htmlContent) {
  const urls = [];
  
  // Extract script src attributes
  const scriptMatches = htmlContent.match(/src="([^"]+)"/g) || [];
  scriptMatches.forEach(match => {
    const url = match.match(/src="([^"]+)"/)[1];
    if (url.startsWith('/webtool/assets/')) {
      urls.push(url);
    }
  });
  
  // Extract link href attributes
  const linkMatches = htmlContent.match(/href="([^"]+)"/g) || [];
  linkMatches.forEach(match => {
    const url = match.match(/href="([^"]+)"/)[1];
    if (url.startsWith('/webtool/assets/')) {
      urls.push(url);
    }
  });
  
  return [...new Set(urls)]; // Remove duplicates
}

// Function to check if file exists
function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

// Main verification
const outDir = path.join(__dirname, '..', 'out');
const htmlFiles = [];

// Find all HTML files
function findHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      findHtmlFiles(fullPath);
    } else if (entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

findHtmlFiles(outDir);

console.log('🔍 Verifying assets...\n');

let totalUrls = 0;
let missingFiles = 0;

htmlFiles.forEach(htmlFile => {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const assetUrls = extractAssetUrls(content);
  
  console.log(`📄 ${path.relative(outDir, htmlFile)}:`);
  
  assetUrls.forEach(url => {
    totalUrls++;
    // Convert URL to file path
    const relativePath = url.replace('/webtool/assets/', '');
    const filePath = path.join(outDir, 'assets', relativePath);
    
    if (checkFileExists(filePath)) {
      console.log(`  ✅ ${url}`);
    } else {
      console.log(`  ❌ ${url} (MISSING)`);
      missingFiles++;
    }
  });
  
  if (assetUrls.length === 0) {
    console.log('  ℹ️  No assets found');
  }
  console.log('');
});

console.log(`📊 Summary:`);
console.log(`  Total assets referenced: ${totalUrls}`);
console.log(`  Missing files: ${missingFiles}`);
console.log(`  Success rate: ${((totalUrls - missingFiles) / totalUrls * 100).toFixed(1)}%`);

if (missingFiles > 0) {
  console.log('\n❌ Some assets are missing! This may cause 404 errors.');
  process.exit(1);
} else {
  console.log('\n✅ All assets are present!');
} 