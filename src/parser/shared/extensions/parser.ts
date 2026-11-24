import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import { isMatched } from '../isMatched.ts'

/** @internal */
export function parseExtensions(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
  entity: any,
) {
  while (isMatched(curr, 102)) {
    const rawValue = curr.value as string
    curr = scanner.next()

    if (!rawValue.startsWith('{')) {
      if (scanner.debug) {
        console.warn(
          `Invalid application group, expected to start with "{" but received: ${rawValue}`,
        )
      }

      curr = skipInvalidExtension(curr, scanner) // points at the next 102 or a 0 group
      if (curr.code === 0) break
      curr = scanner.next()
      continue
    }

    // application-name is form of {appName
    const appName = rawValue.slice(1).trim()

    entity.extensions ??= {}
    // own-property only: names like "__proto__" must not touch the prototype
    if (!Object.prototype.hasOwnProperty.call(entity.extensions, appName)) {
      Object.defineProperty(entity.extensions, appName, {
        value: [],
        writable: true,
        enumerable: true,
        configurable: true,
      })
    }

    curr = parseApplicationGroup(curr, scanner, entity.extensions[appName])
    // an unclosed group ends at the next 0 group (next entity / ENDSEC / EOF);
    // leave it for the caller instead of consuming it
    if (curr.code === 0) break
    curr = scanner.next()
  }
  scanner.rewind()
}

function skipInvalidExtension(curr: ScannerGroup, scanner: DxfArrayScanner) {
  while (!isMatched(curr, 102) && curr.code !== 0) {
    curr = scanner.next()
  }
  return curr
}

function parseApplicationGroup(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
  groupCodes: ScannerGroup[],
) {
  while (!isMatched(curr, 102, '}') && curr.code !== 0) {
    groupCodes.push(curr)
    curr = scanner.next()
  }
  return curr
}
