module.exports = {
    env: {
      browser: true,
      es6: true,
      node: true,
      commonjs: true,
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:react/recommended',
      'plugin:@next/next/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
      project: "./tsconfig.json"
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 0,
      '@typescript-eslint/no-empty-interface': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_[a-zA-Z]', // anything preceded with _
          varsIgnorePattern: '^_[a-zA-Z]',
        },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  };
  