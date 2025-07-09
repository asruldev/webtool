const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Force deploying with cache busting...');

// Add timestamp to force cache invalidation
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const cacheBusterFile = path.join(__dirname, '..', 'out', '.cache-buster');

try {
  // Create cache buster file
  fs.writeFileSync(cacheBusterFile, `Deployed at: ${timestamp}`);
  console.log('✅ Cache buster file created');

  // Delete gh-pages branch if exists
  try {
    execSync('git push origin --delete gh-pages', { stdio: 'pipe' });
    console.log('✅ Old gh-pages branch deleted');
  } catch (error) {
    console.log('ℹ️  No old gh-pages branch to delete');
  }

  // Deploy normally (gh-pages will create new branch)
  execSync('gh-pages -d out', { stdio: 'inherit' });
  console.log('✅ Deployed successfully!');

  // Clean up cache buster file
  fs.unlinkSync(cacheBusterFile);
  console.log('✅ Cache buster file cleaned up');

  console.log('\n🎉 Deployment completed!');
  console.log('📝 Next steps:');
  console.log('   1. Wait 2-5 minutes for GitHub Pages to update');
  console.log('   2. Hard refresh your browser (Ctrl+Shift+R)');
  console.log('   3. Clear browser cache if needed');
  console.log('   4. Test the application');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 