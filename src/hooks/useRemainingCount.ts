import { useAtomValue } from 'jotai';
import { fingerprintAtom } from '@/store/userStore';
import { useRemainingCountQuery } from '@/queries';

export default function useRemainingCount() {
  const fingerprint = useAtomValue(fingerprintAtom);

  return useRemainingCountQuery(
    { fingerprint },
    {
      enabled: Boolean(fingerprint),
      select: ({ count }) => count,
      suspense: true,
    },
  );
}
