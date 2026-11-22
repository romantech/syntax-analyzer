import { customAlphabet } from 'nanoid';

const nanoId = customAlphabet('123456789', 10);

/**
 * Generates a number ID using the nanoId library.
 *
 * @return {number} - The generated number ID.
 */
export const generateNumberID = () => Number(nanoId());
