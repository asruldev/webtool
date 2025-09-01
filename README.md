# Web Tools

A collection of useful web development tools built with React and Vite.

## Features

- **JSON Formatter**: Format, validate, and beautify JSON data
- **JSON Validator**: Validate JSON syntax and get detailed analysis
- **JSON Tree View**: Visualize JSON data in an interactive tree structure
- **Regex Tester**: Test and debug regular expressions interactively
- **JSON Guide**: Learn JSON with examples and best practices
- **Regex Guide**: Learn regular expressions with comprehensive examples


## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and development server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Prism.js** - Syntax highlighting
- **React Icons** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webtool
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
pnpm build
```

The built files will be in the `dist` directory.

### Deployment

The project is configured for GitHub Pages deployment:

```bash
npm run deploy
# or
pnpm deploy
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Footer component
│   ├── JSONFormatter.tsx
│   ├── JSONValidator.tsx
│   ├── JSONTreeView.tsx
│   └── ErrorBoundary.tsx
├── pages/              # Page components
│   ├── Home.tsx        # Home page (JSON Formatter)
│   ├── JSONFormatter.tsx
│   ├── JSONValidator.tsx
│   ├── JSONTreeView.tsx
│   ├── RegexTester.tsx
│   ├── RegexGuide.tsx
│   ├── JSONGuide.tsx

│   ├── PrivacyPolicy.tsx
│   └── Terms.tsx
├── App.tsx             # Main app component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Migration from Next.js

This project was migrated from Next.js to Vite React. Key changes:

- **Routing**: Replaced Next.js App Router with React Router
- **Build System**: Switched from Next.js to Vite
- **File Structure**: Moved from `src/app/` to `src/pages/`
- **Styling**: Updated PostCSS configuration for Vite
- **TypeScript**: Updated configuration for Vite
- **ESLint**: Updated configuration for Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Asrul Harahap**

- GitHub: [@asrulharahap](https://github.com/asrulharahap)
- Website: [asrulharahap.com](https://asrulharahap.com)
