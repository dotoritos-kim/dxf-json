/**
 * 로컬 전용 ACAD_TABLE 실도면 회귀 점검. vitest 스위트에는 포함되지 않는다.
 *
 * 사용법:
 *   npx vite-node scripts/verify-table.ts [파일 또는 폴더 ...]
 *
 * 인자가 없으면 D:\CADView_도면 아래를 재귀 탐색한다. 경로가 없으면 skip(종료코드 0).
 * 원문에서 "0\nACAD_TABLE" 개수와 파싱된 ACAD_TABLE 엔티티(엔티티 + 블록 내부) 수를 비교하고,
 * 필드 이상치(NaN, 음수 행/열, 셀 수 불일치, 행높이/열폭 개수 불일치)를 리포트한다.
 * 도면은 저장소에 커밋하지 않는다.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { extname, join, resolve } from 'path'

import { DxfParser } from '../src/parser/DxfParser.ts'

const DEFAULT_ROOT = 'D:\\CADView_도면'

function collect(p: string, out: string[]) {
  const st = statSync(p)
  if (st.isFile()) {
    if (extname(p).toLowerCase() === '.dxf') out.push(p)
    return
  }
  if (!st.isDirectory()) return
  for (const name of readdirSync(p)) {
    try {
      collect(join(p, name), out)
    } catch {
      // 접근 불가 항목은 건너뜀
    }
  }
}

function decode(buf: Buffer): string {
  const utf8 = buf.toString('utf-8')
  if (!utf8.includes('\uFFFD')) return utf8
  try {
    return new TextDecoder('euc-kr').decode(buf)
  } catch {
    return utf8
  }
}

function countRawTables(text: string): number {
  const m = text.match(/(^|\n)\s*0\s*\r?\n\s*ACAD_TABLE\s*\r?\n/g)
  return m ? m.length : 0
}

function anomalies(t: any): string[] {
  const out: string[] = []
  const num = (k: string) => typeof t[k] === 'number' && Number.isNaN(t[k])
  for (const k of ['rowCount', 'columnCount']) {
    if (num(k)) out.push(`${k}=NaN`)
    if (typeof t[k] === 'number' && t[k] < 0) out.push(`${k}<0`)
  }
  const rows = t.rowCount ?? 0
  const cols = t.columnCount ?? 0
  const cells = t.cells?.length ?? 0
  if (rows * cols !== cells) out.push(`cells=${cells} != ${rows}x${cols}`)
  if (Array.isArray(t.rowHeights) && t.rowHeights.length !== rows)
    out.push(`rowHeights=${t.rowHeights.length} != ${rows}`)
  if (Array.isArray(t.columnWidths) && t.columnWidths.length !== cols)
    out.push(`columnWidths=${t.columnWidths.length} != ${cols}`)
  for (const [i, c] of (t.cells ?? []).entries()) {
    for (const [k, v] of Object.entries(c)) {
      if (typeof v === 'number' && Number.isNaN(v))
        out.push(`cells[${i}].${k}=NaN`)
    }
  }
  return out
}

const inputs = process.argv.slice(2)
const roots = (inputs.length ? inputs : [DEFAULT_ROOT]).map((p) => resolve(p))
const existing = roots.filter((p) => existsSync(p))
if (!existing.length) {
  console.log(`[verify-table] skip: 경로 없음 (${roots.join(', ')})`)
  process.exit(0)
}

const files: string[] = []
for (const r of existing) collect(r, files)

let checked = 0
let mismatched = 0
let failed = 0
let withAnomaly = 0

for (const file of files) {
  let text: string
  try {
    text = decode(readFileSync(file))
  } catch {
    continue
  }
  const raw = countRawTables(text)
  if (!raw) continue
  checked++

  try {
    const start = performance.now()
    const dxf: any = new DxfParser().parseSync(text)
    const ms = performance.now() - start
    const tables: any[] = [
      ...(dxf.entities ?? []),
      ...Object.values(dxf.blocks ?? {}).flatMap((b: any) => b.entities ?? []),
    ].filter((e) => e.type === 'ACAD_TABLE')

    const issues = tables.flatMap((t) =>
      anomalies(t).map((a) => `  - [${t.handle}] ${a}`),
    )
    const ok = tables.length === raw
    if (!ok) mismatched++
    if (issues.length) withAnomaly++
    console.log(
      `${ok ? 'OK ' : 'DIFF'} ${file}  raw=${raw} parsed=${tables.length} cells=${tables.reduce((s, t) => s + (t.cells?.length ?? 0), 0)} ${ms.toFixed(0)}ms`,
    )
    if (issues.length) console.log(issues.slice(0, 20).join('\n'))
  } catch (e) {
    failed++
    console.log(`FAIL ${file}: ${(e as Error).message}`)
  }
}

console.log(
  `\n[verify-table] 검사 ${checked}개 (전체 dxf ${files.length}), 개수 불일치 ${mismatched}, 이상치 포함 ${withAnomaly}, 예외 ${failed}`,
)
process.exit(failed || mismatched ? 1 : 0)
