import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { atom } from 'jotai';

/**
 * 4.0 버전부터 Business Source License 1.1이 적용돼서 배포 목적은 유료 결제 필요
 * {@link https://github.com/fingerprintjs/fingerprintjs/blob/master/LICENSE 라이선스 정보}
 * 3.x 버전은 배포 버전에서도 무료로 사용할 수 있지만 정확도는 떨어짐
 * */
export const fingerprintAtom = atom(async () => {
  const fp = await FingerprintJS.load({ monitoring: false });

  const { visitorId } = await fp.get();
  return visitorId;
});
