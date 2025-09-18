import { describe, expect, test } from "vitest";
import { InsertEntity, InsertEntityParser } from ".";
import { DxfArrayScanner } from "../../DxfArrayScanner";
import { PlotStyleType } from "../../..";

describe("INSERT Entity", () => {
    test('tc0', () => {
        const scanner = new DxfArrayScanner(`0
INSERT
  5
5807D1
330
5807CF
100
AcDbEntity
  8
iamdizzy
  6
ByBlock
347
45
 62
     0
440
 16777216
370
    -2
380
     1
100
AcDbBlockReference
  2
*U2203
 10
1
 20
2
 30
0.0
 50
180.0`.split('\n'))
        const parser = new InsertEntityParser()
        let curr = scanner.next()
        curr = scanner.next() // skip 0 INSERT
        const result = parser.parseEntity(scanner, curr)

        expect(result).toMatchObject({
            handle: '5807D1',
            ownerBlockRecordSoftId: '5807CF',
            subclassMarker: 'AcDbBlockReference',
            layer: 'iamdizzy',
            name: '*U2203',
            lineType: 'ByBlock',
            materialObjectHardId: '45',
            colorIndex: 0,
            transparency: 16777216,
            lineweight: -2,
            plotStyleType: PlotStyleType.ByBlock,
            insertionPoint: { x: 1, y: 2, z: 0 },
            rotation: 180,
        })
    })
});
