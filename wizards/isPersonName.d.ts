import type { SectorFlow } from '../index.js';
/**
 * Checks if a name is a person's name using the SectorFlow API.
 * Uses the "gpt-4o-mini" model (1 credit).
 * @param sectorFlow - The SectorFlow instance.
 * @param name - The name to check.
 * @returns `true` if the name is a person's name, `false` otherwise.
 */
export declare function isPersonName(sectorFlow: SectorFlow, name: string): Promise<boolean>;
