let lastHandle = 0

/**
 * Assigns a handle when the entity has none (e.g. R12 files without code 5).
 *
 * NOTE: the generated handle is a **number** from a module-wide counter
 * (0, 1, 2, ...), not a hex string like real DXF handles, and the counter
 * is not reset between parses. Kept as is for backward compatibility.
 */

export function ensureHandle(entity: any) {
  if (!entity) {
    throw new TypeError('entity cannot be undefined or null')
  }

  if (!entity.handle) {
    entity.handle = lastHandle++
  }
}
