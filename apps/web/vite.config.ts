import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import { mockAnalyzer } from './dev/mock-analyzer.ts';

// https://vitejs.dev/config/
export default defineConfig(({ command, isPreview, mode }) => ({
  // Keep using the repository root's .env files after moving the web app.
  envDir: fileURLToPath(new URL('../../', import.meta.url)),
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: [
    react(),
    command === 'serve' && babel({ presets: ['jotai-babel/preset'] }),
    command === 'serve' && mode === 'mock' && mockAnalyzer(process.env.MOCK_API_SCENARIO),
    mode === 'analyze' ? (visualizer() as unknown as PluginOption) : undefined,

    /**
     * vite-plugin-pwa 플러그인으로 서비스 워커 스크립트 자동 등록
     * 서비스 워커는 웹페이지와 브라우저 사이에서 작동하는 프록시 스크립트
     * 오프라인 모드, 푸시, 백그라운드 데이터 동기화 등의 기능 지원
     * {@link https://vite-pwa-org.netlify.app/guide/}
     * */
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true }, // enable the service worker on development
      workbox:
        command === 'build'
          ? {
              // 온라인에서 새로고침하면 최신 앱을 받고, 오프라인에서는 저장된 앱을 연다.
              directoryIndex: null,
              navigateFallback: null,
              runtimeCaching: [
                {
                  urlPattern: ({ request }) => request.mode === 'navigate',
                  handler: 'NetworkOnly',
                  options: { precacheFallback: { fallbackURL: '/index.html' } },
                },
              ],
            }
          : undefined,
      /**
       * 명시한 manifest 속성을 기반으로 manifest.json 자동 생성되고, public 폴더에 추가됨
       * index.html 파일에는 필요한 링크/스크립트도 자동으로 삽입됨
       * 이미지, 아이콘, robots.txt 같은건 직접 public 폴더에 추가 필요
       * */
      manifest: {
        short_name: '구문 분석기',
        name: 'Syntax Analyzer',
        description:
          'Visual tool for English syntax analysis. Explore and edit sentence structures with a single click. Discover over 30 essential tags and generate tailored random sentences.',
        lang: 'en',
        categories: ['education', 'tools'],
        icons: [
          {
            src: '/favicon-48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/favicon-any.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#111111',
        theme_color: '#111111',
        orientation: 'portrait-primary',
      },
    }),
  ],
  build: {
    // Vite 7의 브라우저 지원 범위를 유지한다.
    target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
    rolldownOptions: {
      output: {
        minify:
          mode === 'production'
            ? { compress: { dropConsole: true, dropDebugger: true } }
            : undefined,
        codeSplitting: {
          groups: [
            { name: 'react', test: /\/node_modules\/(react|react-dom|scheduler)\// },
            { name: 'router', test: /\/node_modules\/react-router\// },
            { name: 'chakra', test: /\/node_modules\/(@chakra-ui|@emotion)\// },
            { name: 'tanstack', test: /\/node_modules\/@tanstack\/(react-query|query-core)\// },
            { name: 'jotai', test: /\/node_modules\/jotai\// },
            { name: 'framer', test: /\/node_modules\/framer-motion\// },
            { name: 'lottie', test: /\/node_modules\/(@lottiefiles|lottie-web)\// },
            { name: 'http', test: /\/node_modules\/(axios|qs)\// },
            { name: 'form', test: /\/node_modules\/(yup|@hookform)\// },
            { name: 'date-fns', test: /\/node_modules\/date-fns\// },
          ],
        },
      },
    },
  },
  server: {
    open: true,
    host: true,
    fs: { allow: [fileURLToPath(new URL('.', import.meta.url))] },
    proxy:
      command === 'serve' && !isPreview && mode !== 'mock'
        ? {
            '^/api/': {
              target: process.env.API_PROXY_TARGET || 'http://localhost:3001',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          }
        : undefined,
  },
  define: {
    /** Jotai Devtools process is not defined 문제 해결
     * @see https://github.com/jotaijs/jotai-devtools/issues/82#issuecomment-1632818246 */
    'process.platform': null,
  },
}));
