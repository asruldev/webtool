# Deployment Guide - Vite + GitHub Pages

This guide explains how to properly deploy a Vite React application to GitHub Pages.

## Configuration Overview

### 1. Vite Configuration (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/webtool/', // Must match your repository name
  build: {
    outDir: 'dist',
  },
})
```

### 2. React Router Configuration (`src/main.tsx`)
```typescript
<BrowserRouter basename="/webtool">
  <App />
</BrowserRouter>
```

### 3. Package.json Configuration
```json
{
  "homepage": "https://asrulharahap.github.io/webtool",
  "scripts": {
    "deploy": "pnpm build && gh-pages -d dist",
    "predeploy": "pnpm build"
  }
}
```

## Key Components

### SPA Routing Support (`public/404.html`)
- Handles client-side routing for GitHub Pages
- `pathSegmentsToKeep = 1` preserves the `/webtool/` base path
- Redirects all routes to the main application

### Redirect Rules (`public/_redirects`)
- Ensures all routes serve the main `index.html`
- Provides proper caching headers for static assets

## Deployment Methods

### Method 1: Manual Deployment
```bash
pnpm deploy
```

### Method 2: GitHub Actions (Recommended)
- Automated deployment on push to `main` branch
- Located in `.github/workflows/deploy.yml`
- Requires GitHub Pages to be set to "GitHub Actions" source

## Setup Steps

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Set source to "GitHub Actions"

2. **Install gh-pages** (if not already installed):
   ```bash
   pnpm add -D gh-pages
   ```

3. **Deploy**:
   ```bash
   pnpm deploy
   ```

## Troubleshooting

### Common Issues

1. **404 Errors on Routes**:
   - Ensure `public/404.html` is properly configured
   - Check that `pathSegmentsToKeep` matches your base path segments

2. **Assets Not Loading**:
   - Verify `base` path in `vite.config.ts` matches repository name
   - Check that `homepage` in `package.json` is correct

3. **Routing Issues**:
   - Confirm `basename` in `BrowserRouter` matches base path
   - Clear browser cache and try again

### Verification

After deployment, your app should be available at:
`https://asrulharahap.github.io/webtool`

All routes should work correctly:
- `https://asrulharahap.github.io/webtool/`
- `https://asrulharahap.github.io/webtool/json-formatter`
- `https://asrulharahap.github.io/webtool/regex`
- etc.

## Notes

- The repository name must match the base path (`webtool`)
- GitHub Pages serves from the `gh-pages` branch
- Static assets are cached aggressively, so clear cache during testing
- The deployment process takes a few minutes to become available
