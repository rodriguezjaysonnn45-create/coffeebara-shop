# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

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

export default defineConfig([
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

## Netlify Deployment

This project is a Vite-built SPA. To deploy to Netlify (static hosting):

- The build output directory is `dist` (Vite default).
- The Netlify build command is `npm run build` and the publish directory is `dist`.

Files added for Netlify:

- `netlify.toml` — configures build command and SPA redirect.
- `public/_redirects` — ensures client-side routing works (rewrites all routes to `index.html`).

Environment / API configuration

- The frontend previously used hard-coded `http://localhost:5002` URLs. It now uses the Vite env var `VITE_API_BASE` at build time.
- On Netlify, set an environment variable named `VITE_API_BASE` to your backend URL (for example `https://api.example.com`). If you don't set it, the app will default to `http://localhost:5002` for local development.

Backend note

- The `server/` folder contains an Express server intended to run separately. Netlify static sites cannot run that server directly. You have these options:
  1. Deploy the backend to a server (Render, Fly, Railway, Heroku, VPS) and set `VITE_API_BASE` to the deployed URL.
  2. Convert backend endpoints to Netlify Functions (serverless) and place them in `netlify/functions` — this requires refactoring.

Quick deploy checklist

1. Build locally to verify:

```powershell
npm run build
```

2. Push your repo to GitHub.
3. Connect the repo in Netlify and use the default build (command `npm run build`, publish `dist`) — the provided `netlify.toml` will be used automatically.
4. Set the `VITE_API_BASE` env var in the Netlify site settings to point to your backend URL.

