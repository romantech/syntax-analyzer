import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import tanstackQueryPlugin from '@tanstack/eslint-plugin-query';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { fixupConfigRules } from '@eslint/compat';

export default tseslint.config(
  // 1. ignores
  { ignores: ['dist', 'eslint.config.js'] },
  // 2. 기본 + TS 추천 설정
  js.configs.recommended,
  tseslint.configs.recommended,
  // 3. 플러그인 flat config
  tanstackQueryPlugin.configs['flat/recommended'],
  // ✅ 구형 API를 호출하는 React 플러그인 설정들을 최신 버전에 맞게 자동으로 패치(호환)
  ...fixupConfigRules([
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat['jsx-runtime'],
  ]),
  // 4. import flat config
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  // 5. 메인 커스텀 설정 블록
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parser: tseslint.parser,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': { typescript: true, node: true },
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      // 플러그인 기본 설정 주입
      ...reactHooksPlugin.configs['recommended'].rules,

      // --- 커스텀 Rules 시작 ---
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // 상수 내보내기 허용
      ],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-param-reassign': ['error', { props: false }],
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
          // 그룹 순서 지정
          groups: [
            'builtin', // Built-in imports go first
            'external', // External imports
            'internal', // Absolute imports
            ['parent', 'sibling'], // Relative imports from siblings and parents can mix
            'index', // index imports
            'object',
            'type',
          ],
          'newlines-between': 'always',
          // 패턴으로 세부적인 순서 지정
          pathGroups: [
            {
              pattern: '{react,react-dom,react-dom/*}',
              group: 'external',
              position: 'before',
            },
          ],
          // 리액트 패키지는 external 그룹에서 알파벳 순이 아닌 상단에 위치시키기 위해 예외 처리
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // 6. Node.js 전역변수 — 서버/설정 파일 전용 ✅
  {
    files: ['vite.config.*', 'vitest.config.*', 'scripts/**/*.{js,ts}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // 7. Prettier — 반드시 마지막 (다른 포맷 규칙 override)
  prettierRecommended,
  {
    rules: {
      // Prettier 포맷 관련 내용은 'warn' 으로 취급(ESLint/Prettier 충돌 방지) ▼
      // { endOfLine: 'auto' } 엔드라인 시퀀스 자동 변경 ▼
      'prettier/prettier': ['warn', { endOfLine: 'auto' }],
    },
  },
);
