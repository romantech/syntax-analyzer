import { useEffect } from 'react';

/**
 * - 어플리케이션을 처음 로드할 때 하얀색 깜빡임 현상을 방지 하기 위해,
 * - index.html-body 태그에 백그라운드 색상(initialColorMode 색상) 설정.
 * - React 로드 이후 body 태그에 지정된 백그라운드 색상 제거
 * */
export const useRemoveBodyBgColor = () => {
  useEffect(() => {
    document.body.style.removeProperty('background-color');
  }, []);
};
