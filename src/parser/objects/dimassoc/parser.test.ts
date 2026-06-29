import { describe, expect, test } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseObjects } from '../parser.ts'
import type { DimAssocDXFObject } from './types.ts'

describe('DIMASSOC parser', () => {
  test('parses DIMASSOC object fields and repeated point references', () => {
    const content = `0
DIMASSOC
5
3A
102
{ACAD_REACTORS
330
1F
102
}
330
2B
100
AcDbDimAssoc
330
4C
90
3
70
1
71
2
1
AcDbOsnapPointRef
72
10
331
AB
73
1
91
11
301
X1
40
0.25
10
1.5
20
2.5
30
3.5
1
AcDbOsnapPointRef
72
6
331
AC
73
2
91
12
301
X2
332
AD
74
3
92
13
302
X3
75
1
0
ENDSEC
0
EOF`.split('\n')

    const scanner = new DxfArrayScanner(content)
    const curr = scanner.next()

    const objects = parseObjects(curr, scanner)

    expect(objects.byName.DIMASSOC).toHaveLength(1)
    expect(objects.byName.DIMASSOC[0]).toMatchObject<DimAssocDXFObject>({
      name: 'DIMASSOC',
      handle: '3A',
      extensions: {
        ACAD_REACTORS: [{ code: 330, value: '1F' }],
      },
      ownerObjectId: '2B',
      subclassMarker: 'AcDbDimAssoc',
      dimensionObjectId: '4C',
      associativityFlag: 3,
      transSpaceFlag: true,
      rotatedDimensionType: 2,
      hasLastPointRef: true,
      pointRefs: [
        {
          className: 'AcDbOsnapPointRef',
          objectOsnapType: 10,
          mainObjectId: 'AB',
          mainObjectSubentityType: 1,
          mainObjectGsMarker: 11,
          mainObjectXrefHandle: 'X1',
          nearOsnapGeometryParameter: 0.25,
          osnapPoint: { x: 1.5, y: 2.5, z: 3.5 },
        },
        {
          className: 'AcDbOsnapPointRef',
          objectOsnapType: 6,
          mainObjectId: 'AC',
          mainObjectSubentityType: 2,
          mainObjectGsMarker: 12,
          mainObjectXrefHandle: 'X2',
          intersectionObjectId: 'AD',
          intersectionObjectSubentityType: 3,
          intersectionObjectGsMarker: 13,
          intersectionObjectXrefHandle: 'X3',
        },
      ],
    })
  })
})