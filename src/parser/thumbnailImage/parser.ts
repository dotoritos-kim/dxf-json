import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'
import { isMatched } from '../shared/isMatched.ts'

export function parseThumbnailImage(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
  format: 'base64' | 'hex' | 'buffer' = 'base64'
): string | Buffer {
  let hexString = ''

  while (!isMatched(curr, 0, 'EOF')) {
    if (isMatched(curr, 0, 'ENDSEC')) {
      break
    }

    if (curr.code === 310) {
      hexString += curr.value
    }
    curr = scanner.next()
  }

  // Convert hex string to requested format
  if (format === 'hex') {
    return hexString
  }

  const buffer = Buffer.from(hexString, 'hex')

  if (format === 'buffer') {
    return buffer
  }

  // Default: base64
  return buffer.toString('base64')
}
