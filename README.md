This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on GitHub Pages

This project is configured for deployment to GitHub Pages. There are two ways to deploy:

## Automatic Deployment (Recommended)

The project uses GitHub Actions for automatic deployment. Every push to the `main` branch will automatically trigger a deployment to GitHub Pages.

To enable this:
1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"

## Manual Deployment

You can also deploy manually using the following commands:

```bash
# Install dependencies (if not already done)
npm install

# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Configuration

The project is configured with:
- `output: 'export'` in `next.config.js` for static site generation
- `gh-pages` package for deployment
- GitHub Actions workflow for automated deployment

Your site will be available at: `https://[username].github.io/[repository-name]/`
