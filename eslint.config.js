'use strict';
// ESLint 9 flat config
const browserGlobals = {
  window: 'readonly', document: 'readonly', navigator: 'readonly', location: 'readonly',
  fetch: 'readonly', FormData: 'readonly', URL: 'readonly', URLSearchParams: 'readonly',
  localStorage: 'readonly', sessionStorage: 'readonly', alert: 'readonly', confirm: 'readonly',
  getComputedStyle: 'readonly', requestAnimationFrame: 'readonly', matchMedia: 'readonly',
  setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly', clearInterval: 'readonly',
  console: 'readonly', IntersectionObserver: 'readonly', MutationObserver: 'readonly',
  CustomEvent: 'readonly', Event: 'readonly', HTMLElement: 'readonly',
};

module.exports = [
  // Node (server) kodi
  {
    files: ['**/*.js'],
    ignores: ['public/js/**', 'public/**', 'admin-static/**', 'node_modules/**', 'data/**', 'dist-sites/**'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: { process: 'readonly', Buffer: 'readonly', console: 'readonly', require: 'readonly', module: 'writable', __dirname: 'readonly', fetch: 'readonly', Request: 'readonly', FormData: 'readonly', Blob: 'readonly', setInterval: 'readonly', setTimeout: 'readonly', URL: 'readonly' },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      eqeqeq: ['warn', 'smart'],
      'no-var': 'warn',
    },
  },
  // Brauzer (frontend) kodi — minifikatsiya qilingan vendor fayllari tekshirilmaydi
  {
    files: ['public/**/*.js', 'admin-static/**/*.js'],
    ignores: ['public/js/**', 'public/i18n.js', 'public/cms-runtime.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'script',
      globals: browserGlobals,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      eqeqeq: ['warn', 'smart'],
    },
  },
];
