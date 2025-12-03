import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'
import { isMatched } from '../shared/isMatched.ts'

export function parseThumbnailImage(curr: ScannerGroup, scanner: DxfArrayScanner) {
  let thumbnailImage = ''

  while (!isMatched(curr, 0, 'EOF')) {
    if (isMatched(curr, 0, 'ENDSEC')) {
      break
    }

    if (curr.code === 310) {
      thumbnailImage += curr.value
    }
    curr = scanner.next()
  }
  return thumbnailImage
}
