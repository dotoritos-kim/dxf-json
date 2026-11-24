/**
 * Local-only SHAPE regression verifier. Not part of the vitest suite.
 *
 * Usage:
 *   npx vite-node ./scripts/verify-shape.ts [file-or-folder]
 *
 * Default folder: D:\CADView_도면 (searched recursively). Only ASCII .dxf files
 * that contain a SHAPE entity are parsed. For each file it compares the raw
 * `0/SHAPE` count (ENTITIES + BLOCKS) with the parsed count and reports field
 * anomalies. If the folder does not exist, it prints a skip message and exits 0.
 * Private drawings stay on disk and are never committed.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { extname, join, resolve } from 'path'

import { DxfParser } from '../src/parser/DxfParser.ts'

const DEFAULT_ROOT = 'D:\\CADView_도면'

function collect(p: string, out: string[] = []): string[] {
  const st = statSync(p)
  if (st.isFile()) {
    if (extname(p).toLowerCase() === '.dxf') out.push(p)
    return out
  }
  for (const name of readdirSync(p)) {
    try {
      collect(join(p, name), out)
    } catch {
      /* unreadable entry */
    }
  }
  return out
}

function countRawShapes(text: string): number {
  const lines = text.split(/\r\n|\r|\n/)
  let n = 0
  for (let i = 0; i + 1 < lines.length; i += 2) {
    if (lines[i].trim() === '0' && lines[i + 1].trim() === 'SHAPE') n++
  }
  return n
}

const isNum = (v: unknown) => typeof v === 'number' && Number.isFinite(v)

function anomalies(e: any): string[] {
  const out: string[] = []
  const p = e.insertionPoint
  if (!p || !isNum(p.x) || !isNum(p.y)) out.push('insertionPoint')
  if (!isNum(e.size)) out.push('size')
  else if (e.size <= 0) out.push(`size<=0(${e.size})`)
  if (typeof e.shapeName !== 'string' || e.shapeName === '')
    out.push('shapeName')
  for (const k of ['rotation', 'xScale', 'obliqueAngle', 'thickness'])
    if (!isNum(e[k])) out.push(k)
  if (isNum(e.xScale) && e.xScale === 0) out.push('xScale=0')
  const d = e.extrusionDirection
  if (!d || !isNum(d.x) || !isNum(d.y) || !isNum(d.z)) out.push('extrusion')
  if (e.subclassMarker !== 'AcDbShape') out.push('subclassMarker')
  return out
}

const root = resolve(process.argv[2] ?? DEFAULT_ROOT)
if (!existsSync(root)) {
  console.log(`[verify-shape] skip: ${root} not found`)
  process.exit(0)
}

const files = collect(root)
let checked = 0
let mismatched = 0
let failed = 0
let totalRaw = 0
let totalParsed = 0
let totalAnomalies = 0

for (const file of files) {
  let text: string
  try {
    const buf = readFileSync(file)
    if (buf.subarray(0, 22).toString('latin1').startsWith('AutoCAD Binary DXF'))
      continue
    text = buf.toString('utf-8')
  } catch {
    continue
  }
  if (!/\n\s*SHAPE\s*\r?\n/.test(text)) continue
  const raw = countRawShapes(text)
  if (raw === 0) continue
  checked++

  let shapes: any[] = []
  try {
    const dxf = new DxfParser().parseSync(text)
    shapes = dxf.entities.filter((e: any) => e.type === 'SHAPE')
    for (const b of Object.values(dxf.blocks ?? {}) as any[])
      for (const e of b.entities ?? []) if (e.type === 'SHAPE') shapes.push(e)
  } catch (err) {
    failed++
    console.log(`FAIL  ${file}: ${(err as Error).message}`)
    continue
  }

  totalRaw += raw
  totalParsed += shapes.length
  const bad = shapes
    .map((e) => [e.handle, anomalies(e)] as const)
    .filter(([, a]) => a.length)
  totalAnomalies += bad.length
  const ok = raw === shapes.length
  if (!ok) mismatched++
  console.log(
    `${ok ? 'OK  ' : 'DIFF'}  raw=${raw} parsed=${shapes.length} anomalies=${bad.length}  ${file}`,
  )
  for (const [h, a] of bad.slice(0, 5)) console.log(`      ${h}: ${a.join(', ')}`)
}

console.log(
  `\n[verify-shape] files=${checked} raw=${totalRaw} parsed=${totalParsed} ` +
    `countMismatch=${mismatched} parseFail=${failed} anomalous=${totalAnomalies}`,
)
if (checked === 0) console.log('[verify-shape] no DXF with SHAPE found (skip)')
process.exit(failed || mismatched ? 1 : 0)
