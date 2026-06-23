/**
 * Local-only verifier for binary DXF files. Not part of the vitest suite.
 *
 * Usage:
 *   npm run verify:binary-dxf -- "D:\path\to\file-or-folder"
 *
 * Pass a single .dxf file or a directory; every .dxf in a directory is parsed.
 * Private fixtures stay on disk and are never committed to the repository.
 */
import { readFileSync, readdirSync, statSync } from 'fs'
import { basename, extname, join, resolve } from 'path'

import { DxfParser } from '../src/parser/DxfParser.ts'
import { isBinaryDxf } from '../src/parser/shared/binaryDxf.ts'

function collectDxfPaths(inputPath: string): string[] {
  const resolved = resolve(inputPath)
  const stat = statSync(resolved)

  if (stat.isFile()) {
    return extname(resolved).toLowerCase() === '.dxf' ? [resolved] : []
  }

  if (!stat.isDirectory()) {
    return []
  }

  return readdirSync(resolved)
    .filter((name) => extname(name).toLowerCase() === '.dxf')
    .map((name) => join(resolved, name))
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`
}

const inputPath = process.argv[2]
if (!inputPath) {
  console.log('usage: npm run verify:binary-dxf -- <file-or-directory>')
  process.exit(1)
}

const paths = collectDxfPaths(inputPath)
if (paths.length === 0) {
  console.error(`No .dxf files found at ${inputPath}`)
  process.exit(1)
}

const parser = new DxfParser()
let failed = 0

for (const filePath of paths) {
  const started = performance.now()
  try {
    const data = new Uint8Array(readFileSync(filePath))
    const kind = isBinaryDxf(data) ? 'binary' : 'ascii'
    const result = parser.parseBuffer(data)
    const elapsed = performance.now() - started
    const entities = result.entities?.length ?? 0
    const blocks = Object.keys(result.blocks ?? {}).length

    console.log(
      `[ok] ${basename(filePath)} (${kind}, ${formatBytes(data.length)}) -> entities=${entities}, blocks=${blocks}, ${elapsed.toFixed(0)} ms`,
    )
  } catch (error) {
    failed += 1
    const elapsed = performance.now() - started
    console.error(
      `[fail] ${basename(filePath)} after ${elapsed.toFixed(0)} ms:`,
      error instanceof Error ? error.message : error,
    )
  }
}

if (failed > 0) {
  console.error(`\n${failed}/${paths.length} file(s) failed.`)
  process.exit(1)
}

console.log(`\nAll ${paths.length} file(s) parsed successfully.`)
