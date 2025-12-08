import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'
import { isMatched } from '../shared/isMatched.ts'

export function parseThumbnailImage(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
  format: 'base64' | 'hex' | 'buffer' = 'base64'
): { size: number; data: string | Buffer } {
  let hexString = ''
  let size = 0

  while (!isMatched(curr, 0, 'EOF')) {
    if (isMatched(curr, 0, 'ENDSEC')) {
      break
    }

    if (curr.code === 90) {
      size = curr.value as number
    } else if (curr.code === 310) {
      hexString += curr.value
    }
    curr = scanner.next()
  }

  // Convert hex string to requested format
  let data: string | Buffer
  if (format === 'hex') {
    data = hexString
  } else {
    const buffer = Buffer.from(hexString, 'hex')
    if (format === 'buffer') {
      data = buffer
    } else {
      // Default: base64
      data = buffer.toString('base64')
    }
  }

  return {
    size,
    data,
  }
}
