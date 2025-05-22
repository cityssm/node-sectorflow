import type { UUIDString } from './types.js'

/**
 * Tests a string to see if it is a valid UUID.
 * @param possibleUUID - A possible UUID.
 * @returns True if the possibleUUID is a valid UUID.
 */
export function isUUID(possibleUUID: string): possibleUUID is UUIDString {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
    possibleUUID.toLowerCase()
  )
}
