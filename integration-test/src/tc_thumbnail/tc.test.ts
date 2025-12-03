import { DxfParser } from '../../../src/index'
import { join } from 'path'
import { readFileSync } from 'fs'

const parser = new DxfParser()
const dxfContent = readFileSync(join(__dirname, 'tc.dxf'), 'utf-8')
const result = parser.parseSync(dxfContent)

if (result.thumbnailImage === '01020304') {
  console.log('Test passed!')
  process.exit(0)
} else {
  console.error('Test failed!')
  console.error('Expected: 01020304')
  console.error('Actual:', result.thumbnailImage)
  process.exit(1)
}
