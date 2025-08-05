if (process.argv.length < 3) {
  console.log('usage: npm print <input file>');
  process.exit(0);
}

const inputPath = process.argv[2]

if (!inputPath.endsWith('.dxf')) {
  console.error(`${inputPath} is not a valid DXF file.`);
  process.exit(1);
}

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path';
import DxfParser from 'dxf-json';

const dirPath = inputPath.split('/').slice(0, -1).join('/');
const projectRoot = join(__dirname, '..', '..', '..');


try {
  const parser = new DxfParser()
  const output = parser.parseSync(readFileSync(join(projectRoot, inputPath), 'utf-8'))
  writeFileSync(join(projectRoot, dirPath, 'out.json'), JSON.stringify(output, null, 2));
} catch (e) {
  console.error(e)
  process.exit(1);
}

