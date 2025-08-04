import { readFileSync } from 'fs'
import { join } from 'path'
import DxfArrayScanner from '@src/parser/DxfArrayScanner'
import { createParser } from '@src/parser/shared/parserGenerator'
import { XRecordDXFObjectSnippet } from './parser'
import { CommonObjectSnippets } from '../shared'
import { RecordCloneFlag } from '../consts'

describe('XRecordParser parser', () => {
  test('tc0', () => {
      const content = readFileSync(join(__dirname, "./tc0.partial_dxf"), "utf-8");
      const scanner = new DxfArrayScanner(content.split("\n"));
      const parser = createParser([ 
        ...XRecordDXFObjectSnippet,
        ...CommonObjectSnippets,
      ]);

      let curr = scanner.next();
      curr = scanner.next(); // skip 0

      const obj: any = {}

      parser(curr, scanner, obj)

      expect(obj).toMatchObject({
        subclassMarker: "AcDbXrecord",
        handle: "14EF",
        ownerObjectId: "B",
        extensions: {
          ACAD_REACTORS: [
            { code: 330, value: "B" }
          ]
        },
        cloneFlag: RecordCloneFlag.KEEP_EXISTING,
        data: [
          { code: 300, value: 'ACD' },
          { code: 300, value: '2019' },
          { code: 300, value: 'ACD_F_S' },
        ]
      })
  })
})