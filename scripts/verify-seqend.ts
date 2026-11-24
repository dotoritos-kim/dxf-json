/**
 * Local-only SEQEND regression verifier. Not part of the vitest suite.
 *
 * Usage:
 *   npx vite-node scripts/verify-seqend.ts [file-or-folder]
 *
 * Default folder: D:\CADView_도면 (recursive). Only .dxf files that contain a
 * SEQEND group are parsed. Reports raw SEQEND count vs parsed count and field
 * anomalies. Exits 0 with "skip" when the folder does not exist.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { extname, join, resolve } from 'path'

import { DxfParser } from '../src/parser/DxfParser.ts'

const root = resolve(process.argv[2] ?? 'D:\CADView_도면')

function collect(p: string, out: string[] = []): string[] {
  let st
  try { st = statSync(p) } catch { return out }
  if (st.isFile()) {
    if (extname(p).toLowerCase() === '.dxf') out.push(p)
  } else if (st.isDirectory()) {
    let names: string[] = []
    try { names = readdirSync(p) } catch { return out }
    for (const n of names) collect(join(p, n), out)
  }
  return out
}

function countRaw(lines: string[]) {
  let n = 0
  for (let i = 0; i + 1 < lines.length; i += 2)
    if (lines[i].trim() === '0' && lines[i + 1].trim() === 'SEQEND') n++
  return n
}

if (!existsSync(root)) {
  console.log(`skip: ${root} not found`)
  process.exit(0)
}

const files = collect(root)
let checked = 0
let mismatches = 0
let failures = 0
let anomalies = 0

for (const file of files) {
  const buf = readFileSync(file)
  const latin = buf.toString('latin1')
  if (!/\r?\nSEQEND\r?\n/.test(latin)) continue
  if (buf.subarray(0, 22).toString('latin1').startsWith('AutoCAD Binary DXF')) continue
  checked++
  const lines = latin.split(/\r\n|\r|\n/)
  const raw = countRaw(lines)
  try {
    const dxf = new DxfParser().parseBuffer(new Uint8Array(buf))
    const all = [
      ...dxf.entities,
      ...Object.values(dxf.blocks as Record<string, any>).flatMap((b) => b.entities ?? []),
    ] as any[]
    const seqends = all.filter((e) => e.type === 'SEQEND')
    const issues: string[] = []
    for (const e of seqends) {
      if (typeof e.handle !== 'string') issues.push(`handle 자동부여(${e.handle})`)
      if (e.ownerBlockRecordSoftId === undefined) issues.push(`owner 없음(${e.handle})`)
      if (e.layer === undefined) issues.push(`layer 없음(${e.handle})`)
      for (const k of ['colorIndex', 'lineweight', 'lineTypeScale'])
        if (typeof e[k] === 'number' && !Number.isFinite(e[k])) issues.push(`${k} 비정상(${e.handle})`)
    }
    const ok = raw === seqends.length
    if (!ok) mismatches++
    anomalies += issues.length
    console.log(
      `${ok ? 'OK  ' : 'DIFF'} raw=${raw} parsed=${seqends.length} issues=${issues.length} ${file}`,
    )
    if (issues.length) console.log('     ' + issues.slice(0, 5).join(', ') + (issues.length > 5 ? ' ...' : ''))
  } catch (err) {
    failures++
    console.log(`FAIL ${file}: ${(err as Error).message}`)
  }
}

console.log(
  `\nfiles=${files.length} withSeqend=${checked} countMismatch=${mismatches} parseFail=${failures} anomalies=${anomalies}`,
)
process.exit(mismatches || failures ? 1 : 0)
