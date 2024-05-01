import { type UUIDString } from './types.js';
/**
 * Tests a string to see if it is a valid UUID.
 * @param {string} possibleUUID - A possible UUID.
 * @returns {boolean} - True if the possibleUUID is a valid UUID.
 */
export declare function isUUID(possibleUUID: string): possibleUUID is UUIDString;
