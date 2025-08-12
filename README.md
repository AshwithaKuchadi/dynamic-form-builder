# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# Dynamic Form Builder

A React + TypeScript + Vite project for building and previewing dynamic forms with ease. This template includes hot module replacement (HMR) and basic ESLint integration.

---

## Features

- Fast Refresh with Vite & React
- TypeScript support
- ESLint integration with recommended and type-aware lint rules
- Dynamic form building & preview functionality

---

## Prerequisites

- Node.js (>=16.x recommended)
- npm or yarn

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
2. Install dependencies
Using npm:

npm install

3. Run the development server

npm run dev

This will start the Vite development server and open your app at http://localhost:5173 (default port).

4. Build for production

npm run build

The output will be in the dist folder.

5. Preview the production build locally


ESLint Configuration
For production-grade linting with type-aware rules, update your ESLint config like this:


export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Use type-aware recommended rules
      ...tseslint.configs.recommendedTypeChecked,
      // Or for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optional stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
You can also add React-specific linting with these plugins:


// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // React lint rules
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
Useful Commands
Command	Description
npm run dev	Start development server with HMR
npm run build	Build production files
npm run preview	Preview production build locally

Folder Structure (Typical)
graphql
Copy
Edit
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Pages like FormBuilder, Preview, MyForms
│   ├── theme.ts        # Theme setup for MUI
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
├── index.html          # HTML template
├── package.json        # NPM scripts and dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── eslint.config.js    # ESLint config (optional)

Learn More
Vite Documentation

React Documentation

TypeScript Documentation

Material-UI Documentation




