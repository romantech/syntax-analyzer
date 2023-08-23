import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    /**
     * react() 는 vitejs/plugin-react 플러그인의 메인 함수
     * 이 플러그인을 통해 React 프로젝트를 빌드하고 개발시 필요한 기능 제공
     * */
    react({
      babel: {
        plugins: [
          /**
           * Jotai 아톰에 대한 React Refresh 지원 플러그인
           * React Refresh 핫리로딩은 코드 변경사항을 반영하면서 상태는 유지하는 기능
           * */
          'jotai/babel/plugin-react-refresh',
          /**
           * Jotai는 리코일 처럼 키(key)가 아닌 객체 참조 기반 작동 -> 아톰 식별자 없음
           * 수동으로 debugLabel을 추가할 수 있지만 번거로움.
           * 아래 플러그인을 사용하면 모든 아톰에 debugLabel 추가해줌(개발자 도구에서 확인 可)
           * */
          'jotai/babel/plugin-debug-label',
        ],
      },
    }),
    tsconfigPaths(),
    visualizer({ open: true }) as unknown as PluginOption,

    /**
     * vite-plugin-pwa 플러그인으로 서비스 워커 스크립트 자동 등록
     * 서비스 워커는 웹페이지와 브라우저 사이에서 작동하는 프록시 스크립트
     * 오프라인 모드, 푸시, 백그라운드 데이터 동기화 등의 기능 지원
     * {@link https://vite-pwa-org.netlify.app/guide/}
     * */
    VitePWA({ registerType: 'autoUpdate' }),
  ],
  server: { open: true },
  define: {
    /** Jotai Devtools process is not defined 문제 해결
     * @see https://github.com/jotaijs/jotai-devtools/issues/82#issuecomment-1632818246 */
    'process.platform': null,
  },
});
