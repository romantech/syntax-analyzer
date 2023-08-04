import { customAlphabet } from 'nanoid';

const nanoId = customAlphabet('123456789', 10);
export const generateNumberID = () => Number(nanoId());

export const factoryQueryKeyGenerator =
  <T>(baseKey: T[]) =>
  <K>(subKey: K[]) => [...baseKey, ...subKey];
