import { isBinaryDxfText } from './binaryDxf.ts'

/**
 * ASCII DXF starts with optional comments (999) or SECTION; binary DXF starts
 * with a fixed marker. See AutoCAD DXF Reference — "Binary DXF Files".
 */
export function assertAsciiDxf(text: string): void {
  const t = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
  if (isBinaryDxfText(t)) {
    throw new Error(
      'Binary DXF cannot be parsed from a text string. Read the file as ArrayBuffer/Uint8Array and use DxfParser.parseBuffer() instead.',
    )
  }
}
