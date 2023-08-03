import { atom } from 'jotai';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const visitorIdAtom = atom(async () => {
  const fp = await FingerprintJS.load({ monitoring: false });

  const { visitorId } = await fp.get();
  return visitorId;
});
