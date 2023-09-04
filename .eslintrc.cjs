module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true, // Node.js 환경의 전역 변수 등록
  },
  extends: [
    'eslint:recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],
  settings: {
    react: { version: 'detect' },
    'import/resolver': { typescript: true, node: true },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }, // 상수 내보내기 허용
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Prettier 포맷 관련 내용은 'warn' 으로 취급(ESLint/Prettier 충돌 방지) ▼
    // { endOfLine: 'auto' } 엔드라인 시퀀스 자동 변경 ▼
    'prettier/prettier': ['warn', { endOfLine: 'auto' }],
    'no-param-reassign': ['error', { props: false }],
    'react/react-in-jsx-scope': 'off',
    'prefer-const': 'warn',
    'no-plusplus': 'off',
    'vars-on-top': 'off',
    'no-underscore-dangle': 'off', // var _foo;
    'comma-dangle': 'off',
    'func-names': 'off', // setTimeout(function () {}, 0);
    'prefer-arrow-callback': 'off', // setTimeout(function () {}, 0);
    'prefer-template': 'off',
    'no-nested-ternary': 'off',
    'max-classes-per-file': 'off',
    'no-restricted-syntax': ['off', 'ForOfStatement'],
    'consistent-return': 'warn',
    'react/prop-types': 'off',
    'no-unused-expressions': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_', // _로 시작하는 인자 무시
        varsIgnorePattern: '^_', // _로 시작하는 변수 무시
      },
    ],

    /** import 정렬 관련 설정 */
    'import/no-unresolved': 'error',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin', // Built-in imports go first
          'external', // External imports
          'internal', // Absolute imports
          ['sibling', 'parent'], // Relative imports from siblings and parents can mix
          'index', // index imports
          'unknown', // unknown
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};
