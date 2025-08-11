import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, expect, test } from "vitest";
import { DxfArrayScanner } from '../../DxfArrayScanner';
import { createParser } from '../../shared/parserGenerator';
import { DictionarySnippets } from './parser';
import type { DictionaryDXFObject } from './types';

describe("DICTIONARY parser", () => {
    test('tc0', () => {
      const content = readFileSync(join(__dirname, "./tc0.partial_dxf"), "utf-8");
      const scanner = new DxfArrayScanner(content.split("\n"));
      const parser = createParser(DictionarySnippets);

      let curr = scanner.next()
      curr = scanner.next(); // skip 0

      const obj: any = { name: 'DICTIONARY' }

      parser(curr, scanner, obj)

      expect(obj).toMatchObject<DictionaryDXFObject>({
        name: 'DICTIONARY',
        handle: "2D2",
        ownerObjectId: "2C6",
        subclassMarker: "AcDbDictionary",
        isHardOwned: true,
        recordCloneFlag: 1,
        entries: [
          {
            name: "ACAD_FILTER",
            objectHardId: "2D3"
          }
        ]
      })
    })
});