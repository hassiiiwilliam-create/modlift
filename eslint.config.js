import js from '@eslint/js'
import globals from 'globals'

let reactHooks = null
let reactRefresh = null

try {
  const module = await import('eslint-plugin-react-hooks')
  reactHooks = module.default || module
} catch (err) {
  console.warn('eslint-plugin-react-hooks not found, skipping related config')
}

try {
  const module = await import('eslint-plugin-react-refresh')
  reactRefresh = module.default || module
} catch (err) {
  console.warn('eslint-plugin-react-refresh not found, skipping related config')
}

const configs = [
  {
    ignores: ['dist'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      ...(reactHooks ? { 'react-hooks': reactHooks } : {}),
      ...(reactRefresh ? { 'react-refresh': reactRefresh } : {}),
    },
    rules: {
      ...(js.configs.recommended.rules || {}),
      ...(reactHooks?.configs?.['recommended-latest']?.rules || {}),
      ...(reactRefresh?.configs?.vite?.rules || {}),
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]

export default configs
