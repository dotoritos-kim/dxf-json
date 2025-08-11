import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner'
import { createParser } from '../../shared/parserGenerator'
import { XRecordDXFObjectSnippet } from './parser'
import { RecordCloneFlag } from '../consts'
import type { XRecordDXFObject } from './types';

describe('XRecordParser parser', () => {
  test('tc0', () => {
      const content = readFileSync(join(__dirname, "./tc0.partial_dxf"), "utf-8");
      const scanner = new DxfArrayScanner(content.split("\n"));
      const parser = createParser(XRecordDXFObjectSnippet);

      let curr = scanner.next();
      curr = scanner.next(); // skip 0

      const obj: any = { name: 'XRECORD' }

      parser(curr, scanner, obj)

      expect(obj).toMatchObject<XRecordDXFObject>({
        name: 'XRECORD',
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