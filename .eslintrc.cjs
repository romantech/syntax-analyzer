module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true, // Node.js 환경의 전역 변수 등록
  },
  extends: [
    'plugin:react/jsx-runtime',
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react/react-in-jsx-scope': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Prettier 가 잡은 내용은 'warn' 으로 취급하도록 설정(ESLint - Prettier 충돌 방지) ▼
    // { endOfLine: 'auto' }는 엔드라인 시퀀스 자동 변경 ▼
    'prettier/prettier': ['warn', { endOfLine: 'auto' }],
    'no-param-reassign': ['error', { props: false }],
    'prefer-const': 1,
    'no-plusplus': 0,
    'vars-on-top': 0,
    'no-underscore-dangle': 0, // var _foo;
    'comma-dangle': 0,
    'func-names': 0, // setTimeout(function () {}, 0);
    'prefer-arrow-callback': 0, // setTimeout(function () {}, 0);
    'prefer-template': 0,
    'no-nested-ternary': 0,
    'max-classes-per-file': 0,
    'no-restricted-syntax': [0, 'ForOfStatement'],
    'consistent-return': 1,
    'no-unused-vars': 0,
    'no-unused-expressions': 1,
    'react/prop-types': 0,
    'react-hooks/exhaustive-deps': [
      'warn',
      { additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)' },
    ],
    '@typescript-eslint/no-unused-vars': 1,
  },
};
