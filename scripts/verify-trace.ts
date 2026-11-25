/**
 * Local-only regression check for TRACE entities against real drawings.
 * Not part of the vitest suite.
 *
 * Usage:
 *   npx vite-node scripts/verify-trace.ts [path-to-file-or-folder]
 *
 * Default path: D:\CADView_도면 (searched recursively). Only .dxf files whose
 * raw text contains a TRACE entity are parsed. If the path does not exist the
 * script prints a skip message and exits 0.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { extname, join, resolve } from 'path'

import { DxfParser } from '../src/parser/DxfParser.ts'
import { isBinaryDxf } from '../src/parser/shared/binaryDxf.ts'

const DEFAULT_PATH = 'D:\\CADView_도면'

function collect(path: string, out: string[] = []): string[] {
  const stat = statSync(path)
  if (stat.isFile()) {
    if (extname(path).toLowerCase() === '.dxf') out.push(path)
    return out
  }
  if (stat.isDirectory()) {
    for (const name of readdirSync(path)) {
      try {
        collect(join(path, name), out)
      } catch {
        // unreadable entry: ignore
      }
    }
  }
  return out
}

/** Counts `0 / TRACE` group pairs in the raw ASCII text (all sections). */
function countRawTraces(text: string): number {
  const lines = text.split(/\r?\n/)
  let count = 0
  for (let i = 0; i + 1 < lines.length; i += 2) {
    if (lines[i].trim() === '0' && lines[i + 1].trim() === 'TRACE') count++
  }
  return count
}

function isBad(n: unknown) {
  return typeof n !== 'number' || !Number.isFinite(n)
}

function anomalies(t: any): string[] {
  const out: string[] = []
  if (!Array.isArray(t.points)) out.push('points missing')
  else {
    if (t.points.length !== 4) out.push(`points.length=${t.points.length}`)
    t.points.forEach((p: any, i: number) => {
      if (isBad(p?.x) || isBad(p?.y) || (p?.z !== undefined && isBad(p.z)))
        out.push(`points[${i}] non-finite`)
      if (Math.abs(p?.x) > 1e12 || Math.abs(p?.y) > 1e12) out.push(`points[${i}] huge`)
    })
  }
  if (isBad(t.thickness)) out.push(`thickness=${t.thickness}`)
  const e = t.extrusionDirection
  if (!e || isBad(e.x) || isBad(e.y) || isBad(e.z)) out.push('extrusion non-finite')
  else {
    const len = Math.hypot(e.x, e.y, e.z)
    if (Math.abs(len - 1) > 1e-6) out.push(`extrusion |v|=${len}`)
  }
  if (t.layer === undefined) out.push('layer missing')
  return out
}

function collectParsedTraces(dxf: any): any[] {
  const all: any[] = []
  for (const e of dxf.entities ?? []) if (e.type === 'TRACE') all.push(e)
  for (const b of Object.values<any>(dxf.blocks ?? {}))
    for (const e of b.entities ?? []) if (e.type === 'TRACE') all.push(e)
  return all
}

const target = resolve(process.argv[2] ?? DEFAULT_PATH)
if (!existsSync(target)) {
  console.log(`[verify-trace] skip: ${target} not found`)
  process.exit(0)
}

const files = collect(target)
let filesWithTrace = 0
let mismatched = 0
let failed = 0
let anomalyCount = 0

for (const file of files) {
  const buf = readFileSync(file)
  const bytes = new Uint8Array(buf)
  if (isBinaryDxf(bytes)) continue
  const text = buf.toString('latin1')
  const raw = countRawTraces(text)
  if (raw === 0) continue
  filesWithTrace++

  try {
    const dxf = new DxfParser().parseBuffer(bytes)
    const traces = collectParsedTraces(dxf)
    const status = traces.length === raw ? 'OK ' : 'DIFF'
    if (traces.length !== raw) mismatched++
    console.log(`${status} raw=${raw} parsed=${traces.length}  ${file}`)
    for (const t of traces) {
      const a = anomalies(t)
      if (a.length) {
        anomalyCount++
        if (anomalyCount <= 200) console.log(`     handle=${t.handle}: ${a.join(', ')}`)
      }
    }
  } catch (err) {
    failed++
    console.log(`FAIL ${file}: ${(err as Error).message}`)
  }
}

console.log(
  `\n[verify-trace] scanned=${files.length} withTrace=${filesWithTrace} ` +
    `countMismatch=${mismatched} parseFail=${failed} anomalousEntities=${anomalyCount}`,
)
if (failed > 0 || mismatched > 0) process.exitCode = 1
