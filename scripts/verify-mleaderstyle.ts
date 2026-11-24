/**
 * Local-only regression verifier for MLEADERSTYLE parsing against real drawings.
 * Not part of the vitest suite. Private drawings stay on disk and are never committed.
 *
 * Usage:
 *   npx vite-node scripts/verify-mleaderstyle.ts [file-or-directory ...]
 *
 * Default root: D:\CADView_도면 (searched recursively). If no path exists, the
 * script prints "skip" and exits 0.
 *
 * For every ASCII/binary .dxf that contains MLEADERSTYLE it reports:
 *   - raw count of `0 / MLEADERSTYLE` groups inside the OBJECTS section
 *   - parsed count (dxf.objects.byName.MLEADERSTYLE)
 *   - field anomalies (missing handle/subclass, NaN numbers, unexpected types,
 *     group codes inside the raw object that the parser does not know)
 * Exit code 1 when any file throws or raw/parsed counts differ.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { extname, join, resolve } from 'path'

import { DxfParser } from '../src/parser/DxfParser.ts'
import { isBinaryDxf } from '../src/parser/shared/binaryDxf.ts'
import { dxfInputToLines } from '../src/parser/shared/dxfInput.ts'
import { MLeaderStyleSnippets } from '../src/parser/objects/mleaderStyle/parser.ts'

const DEFAULT_ROOT = 'D:\\CADView_도면'

const KNOWN_CODES = new Set<number>(
  MLeaderStyleSnippets.flatMap((s) =>
    typeof s.code === 'number' ? [s.code] : s.code,
  ),
)

const NUMBER_FIELDS = [
  'contentType',
  'drawMLeaderOrderType',
  'drawLeaderOrderType',
  'maxLeaderSegmentPoints',
  'firstSegmentAngleConstraint',
  'secondSegmentAngleConstraint',
  'leaderLineType',
  'leaderLineColor',
  'leaderLineWeight',
  'landingGap',
  'doglegLength',
  'arrowheadSize',
  'textLeftAttachmentType',
  'textAngleType',
  'textAlignmentType',
  'textRightAttachmentType',
  'textColor',
  'textHeight',
  'alignSpace',
  'blockContentColor',
  'blockContentRotation',
  'blockContentConnectionType',
  'scale',
  'breakGapSize',
  'textAttachmentDirection',
  'bottomTextAttachmentDirection',
  'topTextAttachmentDirection',
]

function collectDxfPaths(inputPath: string, out: string[] = []): string[] {
  let stat
  try {
    stat = statSync(inputPath)
  } catch {
    return out
  }
  if (stat.isFile()) {
    if (extname(inputPath).toLowerCase() === '.dxf') out.push(inputPath)
    return out
  }
  if (!stat.isDirectory()) return out
  let names: string[] = []
  try {
    names = readdirSync(inputPath)
  } catch {
    return out
  }
  for (const name of names) collectDxfPaths(join(inputPath, name), out)
  return out
}

/** Walks raw lines and returns code lists of every MLEADERSTYLE in OBJECTS. */
function scanRaw(lines: string[]) {
  const objects: number[][] = []
  let inObjects = false
  let current: number[] | null = null
  for (let i = 0; i + 1 < lines.length; i += 2) {
    const code = parseInt(lines[i], 10)
    const value = lines[i + 1].trim()
    if (code === 2 && value === 'OBJECTS') inObjects = true
    if (code === 0) {
      if (current) objects.push(current)
      current = null
      if (value === 'ENDSEC') inObjects = false
      else if (inObjects && value === 'MLEADERSTYLE') current = []
      continue
    }
    current?.push(code)
  }
  if (current) objects.push(current)
  return objects
}

function anomaliesOf(obj: any): string[] {
  const issues: string[] = []
  if (!obj.handle) issues.push('missing handle')
  if (obj.subclassMarker !== 'AcDbMLeaderStyle')
    issues.push(`subclassMarker=${JSON.stringify(obj.subclassMarker)}`)
  for (const field of NUMBER_FIELDS) {
    const v = obj[field]
    if (v === undefined) continue
    if (typeof v !== 'number') issues.push(`${field} not number (${typeof v})`)
    else if (!Number.isFinite(v)) issues.push(`${field}=${v}`)
  }
  if (obj.textHeight !== undefined && obj.textHeight < 0)
    issues.push(`textHeight<0 (${obj.textHeight})`)
  if (obj.scale !== undefined && obj.scale < 0) issues.push(`scale<0`)
  const s = obj.blockContentScale
  if (s && [s.x, s.y, s.z].some((n: any) => n !== undefined && !Number.isFinite(n)))
    issues.push('blockContentScale has non-finite')
  return issues
}

const args = process.argv.slice(2)
const roots = (args.length ? args : [DEFAULT_ROOT]).map((p) => resolve(p))
const existingRoots = roots.filter((p) => existsSync(p))
if (existingRoots.length === 0) {
  console.log(`skip: no drawing path found (${roots.join(', ')})`)
  process.exit(0)
}

const paths = existingRoots.flatMap((r) => collectDxfPaths(r))
const parser = new DxfParser()
let filesWithStyle = 0
let totalRaw = 0
let totalParsed = 0
let failed = 0
const unknownCodes = new Map<number, number>()

for (const filePath of paths) {
  let data: Uint8Array
  try {
    data = new Uint8Array(readFileSync(filePath))
  } catch (err) {
    console.log(`READ-FAIL ${filePath}: ${(err as Error).message}`)
    continue
  }
  const binary = isBinaryDxf(data)
  let lines: string[]
  try {
    lines = dxfInputToLines(data)
  } catch (err) {
    console.log(`DECODE-FAIL ${filePath}: ${(err as Error).message}`)
    continue
  }
  const raw = scanRaw(lines)
  if (raw.length === 0) continue
  filesWithStyle++

  for (const codes of raw)
    for (const c of codes)
      if (!KNOWN_CODES.has(c) && !(c >= 1000 && c <= 1071))
        unknownCodes.set(c, (unknownCodes.get(c) ?? 0) + 1)

  try {
    const started = performance.now()
    const dxf = parser.parseBuffer(data)
    const ms = performance.now() - started
    const parsed = (dxf.objects?.byName?.MLEADERSTYLE ?? []) as any[]
    totalRaw += raw.length
    totalParsed += parsed.length
    const issues = parsed.flatMap((o, i) =>
      anomaliesOf(o).map((m) => `#${i}(${o.handle}) ${m}`),
    )
    const status = parsed.length === raw.length ? 'OK  ' : 'DIFF'
    if (status === 'DIFF') failed++
    console.log(
      `${status} raw=${raw.length} parsed=${parsed.length} ${ms.toFixed(0)}ms ${binary ? 'bin' : 'ascii'} ${filePath}`,
    )
    for (const issue of issues) console.log(`     anomaly: ${issue}`)
  } catch (err) {
    failed++
    console.log(`FAIL ${filePath}: ${(err as Error).message}`)
  }
}

console.log('---')
console.log(
  `dxf files=${paths.length} with MLEADERSTYLE=${filesWithStyle} raw=${totalRaw} parsed=${totalParsed} failed=${failed}`,
)
if (unknownCodes.size)
  console.log(
    'codes in raw MLEADERSTYLE not covered by snippets:',
    [...unknownCodes.entries()].map(([c, n]) => `${c}x${n}`).join(', '),
  )
process.exit(failed ? 1 : 0)
