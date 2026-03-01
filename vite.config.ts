import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

import { dependencies } from './package.json';

/** Filter out React-related dependencies from the list */
const reactDeps = Object.keys(dependencies).filter(
  (key) => key === 'react' || key.startsWith('react-'),
);

/**
 * Generates custom chunks for Rollup or Vite based on the dependencies provided.
 * The 'vendor' chunk includes all React-related dependencies, while additional chunks
 * are created for each remaining dependency not already included in 'vendor'.
 * For more information on this approach, see the following article:
 * {@link https://sambitsahoo.com/blog/vite-code-splitting-that-works.html Referenced Code}
 */
const manualChunks = {
  // Include all React-related dependencies in a 'vendor' chunk
  vendor: reactDeps,
  // Generate additional chunks for remaining dependencies
  ...Object.keys(dependencies).reduce((chunks, name) => {
    // Skip dependencies already included in 'vendor'
    if (!reactDeps.includes(name)) chunks[name] = [name];
    return chunks;
  }, {}),
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    /**
     * react() 는 vitejs/plugin-react 플러그인의 메인 함수
     * 이 플러그인을 통해 React 프로젝트를 빌드하고 개발시 필요한 기능 제공
     * */
    react({
      babel: {
        /**
         * plugin-react-refresh + plugin-debug-label 둘 다 포함
         * [jotai/babel/plugin-react-refresh]
         * Jotai 아톰에 대한 React Refresh 지원 플러그인
         * React Refresh 핫리로딩은 코드 변경사항을 반영하면서 상태는 유지하는 기능
         *
         * [jotai/babel/plugin-debug-label]
         * Jotai 는 리코일 처럼 키(key)가 아닌 객체 참조 기반 작동 -> 아톰 식별자 없음
         * 수동으로 debugLabel 을 추가할 수 있지만 번거로움.
         * 아래 플러그인을 사용하면 모든 아톰에 debugLabel 추가해줌(개발자 도구에서 확인 可)
         * */
        presets: ['jotai-babel/preset'],
      },
    }),
    tsconfigPaths(),
    visualizer() as unknown as PluginOption,

    /**
     * vite-plugin-pwa 플러그인으로 서비스 워커 스크립트 자동 등록
     * 서비스 워커는 웹페이지와 브라우저 사이에서 작동하는 프록시 스크립트
     * 오프라인 모드, 푸시, 백그라운드 데이터 동기화 등의 기능 지원
     * {@link https://vite-pwa-org.netlify.app/guide/}
     * */
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true }, // enable the service worker on development
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
        background_color: '#1a202b',
        theme_color: '#1a202b',
        orientation: 'portrait-primary',
      },
    }),
  ],
  esbuild: {
    /** 배포 환경에서만 콘솔/디버거 비활성; 참고로 build.minify 기본값은 esbuild */
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  build: { rollupOptions: { output: { manualChunks } } },
  server: { open: true },
  define: {
    /** Jotai Devtools process is not defined 문제 해결
     * @see https://github.com/jotaijs/jotai-devtools/issues/82#issuecomment-1632818246 */
    'process.platform': null,
  },
}));
