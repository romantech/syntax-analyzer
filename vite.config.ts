import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Vite(Rollup) 빌드 시 적용되는 커스텀 청크 분할(Code Splitting) 함수
 * * package.json의 전체 의존성을 무조건 청크로 만들 때 발생하던 "Generated an empty chunk" 경고를 방지하기 위해,
 * 빌드 파이프라인에 포함된 실제 `node_modules` 내부 모듈(`id`)만 대상으로 청크를 분리합니다.
 * 사용 목적과 업데이트 주기가 비슷한 패키지들을 하나의 그룹(chunk)으로 묶어 브라우저 캐시 효율을 극대화합니다.
 * * @param {string} id - Rollup이 현재 처리 중인 모듈의 절대 경로
 * @returns {string | undefined} 묶어줄 청크 이름. 명시되지 않은 모듈은 Rollup의 기본 분할 전략에 위임(`undefined`)
 */
const manualChunks = (id: string): string | undefined => {
  if (!id.includes('node_modules')) return undefined;

  // 경로 구분자 통일 (Windows 환경 호환성)
  const p = id.replace(/\\/g, '/');

  // pnpm 심볼릭 링크 구조 대응: .../.pnpm/pkg@ver/node_modules/pkg/...
  const inPkg = (name: string) => p.includes(`/node_modules/${name}/`);

  // 1. 코어 라이브러리 (React 생태계)
  if (inPkg('react') || inPkg('react-dom') || inPkg('scheduler'))
    return 'react';
  if (inPkg('react-router') || inPkg('react-router-dom')) return 'router';

  // 2. UI 및 스타일링 (Chakra UI는 Emotion을 강하게 의존)
  if (inPkg('@chakra-ui') || inPkg('@emotion')) return 'chakra';

  // 3. 상태 및 데이터 페칭
  if (inPkg('@tanstack/react-query') || inPkg('@tanstack/query-core'))
    return 'tanstack';
  if (inPkg('jotai')) return 'jotai';

  // 4. 애니메이션 및 미디어
  if (inPkg('framer-motion')) return 'framer';
  if (inPkg('@lottiefiles') || inPkg('lottie-web')) return 'lottie';

  // 5. 유틸리티 (HTTP 통신, 폼 검증, 날짜)
  if (inPkg('axios') || inPkg('qs')) return 'http';
  if (inPkg('yup') || inPkg('@hookform')) return 'form';
  if (inPkg('date-fns')) return 'date-fns';

  // 6. 나머지는 Rollup의 기본 트리쉐이킹 및 청크 분할 알고리즘에 위임
  return undefined;
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
