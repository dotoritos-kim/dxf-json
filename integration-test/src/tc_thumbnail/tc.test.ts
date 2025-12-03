import { DxfParser } from '../../../src/index'
import { join } from 'path'
import { readFileSync } from 'fs'

const dxfContent = readFileSync(join(__dirname, 'tc.dxf'), 'utf-8')

// Test 1: Default format (base64)
const parser1 = new DxfParser()
const result1 = parser1.parseSync(dxfContent)

// Expected base64 value of hex '01020304'
const expectedBase64 = Buffer.from('01020304', 'hex').toString('base64')

if (result1.thumbnailImage === expectedBase64) {
  console.log('Test 1 passed: base64 format (default)')
} else {
  console.error('Test 1 failed!')
  console.error('Expected:', expectedBase64)
  console.error('Actual:', result1.thumbnailImage)
  process.exit(1)
}

// Test 2: Hex format
const parser2 = new DxfParser({ thumbnailImageFormat: 'hex' })
const result2 = parser2.parseSync(dxfContent)

if (result2.thumbnailImage === '01020304') {
  console.log('Test 2 passed: hex format')
} else {
  console.error('Test 2 failed!')
  console.error('Expected: 01020304')
  console.error('Actual:', result2.thumbnailImage)
  process.exit(1)
}

console.log('All tests passed!')
process.exit(0)
