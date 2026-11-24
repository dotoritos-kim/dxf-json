/**
 * Local-only SURFACE regression verifier. Not part of the vitest suite.
 *
 * Usage:
 *   npx vite-node scripts/verify-surface.ts [file-or-folder]
 *   (default: D:\CADView_도면, searched recursively)
 *
 * Finds .dxf files that contain SURFACE-family entities, parses them and
 * compares raw `0 <TYPE>` counts with parsed counts (ENTITIES + BLOCKS),
 * then reports field anomalies. Skips (exit 0) when no drawings exist.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { extname, join, resolve } from 'path'

import { DxfParser } from '../src/parser/DxfParser.ts'
import { isBinaryDxf } from '../src/parser/shared/binaryDxf.ts'

const TYPES = [
  'SURFACE', 'PLANESURFACE', 'NURBSURFACE', 'EXTRUDEDSURFACE',
  'SWEPTSURFACE', 'REVOLVEDSURFACE', 'LOFTEDSURFACE',
]
const MATRIX_FIELDS = [
  'transform', 'sweepEntityTransform', 'pathEntityTransform',
  'sweepEntityTransformMatrix', 'pathEntityTransformMatrix',
]

function collect(p: string, out: string[] = []): string[] {
  const st = statSync(p)
  if (st.isFile()) {
    if (extname(p).toLowerCase() === '.dxf') out.push(p)
  } else if (st.isDirectory()) {
    for (const n of readdirSync(p)) {
      try {
        collect(join(p, n), out)
      } catch {
        /* unreadable entry */
      }
    }
  }
  return out
}

function rawCounts(text: string): Record<string, number> {
  const counts: Record<string, number> = {}
  const lines = text.split(/\r?\n/)
  for (let i = 0; i + 1 < lines.length; i += 2) {
    if (lines[i].trim() !== '0') continue
    const t = lines[i + 1].trim()
    if (TYPES.includes(t)) counts[t] = (counts[t] ?? 0) + 1
  }
  return counts
}

function anomalies(e: any): string[] {
  const out: string[] = []
  if (!e.handle) out.push('no handle')
  if (e.subclassMarker !== 'AcDbSurface') out.push('missing AcDbSurface')
  for (const k of ['uIsolineCount', 'vIsolineCount']) {
    const v = e[k]
    if (v !== undefined && (!Number.isInteger(v) || v < 0)) out.push(`${k}=${v}`)
  }
  for (const k of MATRIX_FIELDS) {
    if (e[k] !== undefined && e[k].length !== 16) out.push(`${k}.length=${e[k].length}`)
  }
  for (const [k, v] of Object.entries(e)) {
    if (typeof v === 'number' && !Number.isFinite(v)) out.push(`${k}=${v}`)
  }
  for (const [s, d] of [
    ['sweepEntityDataSize', 'sweepEntityData'],
    ['pathEntityDataSize', 'pathEntityData'],
    ['revolveEntityDataSize', 'revolveEntityData'],
  ]) {
    if (e[s] !== undefined && e[d] !== undefined && e[d].length !== e[s] * 2) {
      out.push(`${d}.length=${e[d].length} != ${s}*2=${e[s] * 2}`)
    }
  }
  return out
}

const root = resolve(process.argv[2] ?? 'D:\\CADView_도면')
if (!existsSync(root)) {
  console.log(`[skip] path not found: ${root}`)
  process.exit(0)
}

let files = 0
let failed = 0
for (const file of collect(root)) {
  const buf = readFileSync(file)
  if (isBinaryDxf(buf)) continue
  const text = buf.toString('utf-8')
  if (!/\n\s*0\r?\n(SURFACE|[A-Z]+SURFACE)\r?\n/.test(text)) continue
  const raw = rawCounts(text)
  if (!Object.keys(raw).length) continue
  files++

  const parsed: Record<string, number> = {}
  const issues: string[] = []
  try {
    const dxf: any = new DxfParser().parseSync(text)
    const all = [
      ...(dxf.entities ?? []),
      ...Object.values(dxf.blocks ?? {}).flatMap((b: any) => b.entities ?? []),
    ]
    for (const e of all) {
      if (!TYPES.includes(e.type)) continue
      parsed[e.type] = (parsed[e.type] ?? 0) + 1
      const a = anomalies(e)
      if (a.length && issues.length < 20) issues.push(`${e.type} ${e.handle}: ${a.join(', ')}`)
    }
  } catch (err) {
    failed++
    console.log(`[FAIL] ${file}: ${(err as Error).message}`)
    continue
  }

  const mismatch = TYPES.filter((t) => (raw[t] ?? 0) !== (parsed[t] ?? 0))
  if (mismatch.length || issues.length) failed++
  const tag = mismatch.length ? 'MISMATCH' : issues.length ? 'WARN' : 'OK'
  console.log(`[${tag}] ${file}`)
  for (const t of TYPES) {
    if (raw[t] || parsed[t]) console.log(`    ${t}: raw ${raw[t] ?? 0} / parsed ${parsed[t] ?? 0}`)
  }
  for (const i of issues) console.log(`    - ${i}`)
}

if (!files) console.log(`[skip] no SURFACE-bearing ASCII .dxf under ${root}`)
else console.log(`\n${files} file(s), ${failed} with problems`)
process.exit(failed ? 1 : 0)
