import type { DxfArrayScanner } from './DxfArrayScanner.ts'

/** Some entities may contain embedded object which is started by group 101. All the rest data until
 * end of entity should not be interpreted as entity attributes. There is no documentation for this
 * feature.
 * @param scanner
 */
export function skipEmbeddedObject(scanner: DxfArrayScanner) {
  /* Ensure proper start group. */
  scanner.rewind()
  let curr = scanner.next()
  if (curr.code !== 101) {
    throw new Error('Bad call for skipEmbeddedObject()')
  }
  do {
    curr = scanner.next()
  } while (curr.code !== 0)
  scanner.rewind()
}
