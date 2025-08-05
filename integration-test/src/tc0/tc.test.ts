import { readFileSync } from 'fs';
import { join } from 'path';
import DxfParser from 'dxf-json'

describe('integration tc0', () => {
  test('tc0', () => {
    const content = readFileSync(join(__dirname, './tc.dxf'), 'utf-8');
    const parser = new DxfParser()
    const dxf = parser.parseSync(content)
    const answer = JSON.parse(readFileSync(join(__dirname, './tc.json'), 'utf-8'))

    expect(dxf).toMatchObject(answer)
  })
})