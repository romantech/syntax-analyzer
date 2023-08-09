import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { atom } from 'jotai';

export const fingerprintAtom = atom(async () => {
  const fp = await FingerprintJS.load({ monitoring: false });

  const { visitorId } = await fp.get();
  return visitorId;
});
