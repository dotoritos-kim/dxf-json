import { describe, expect, test } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseObjects } from '../parser.ts'
import type { MLineStyleDXFObject } from './types.ts'

describe('MLINESTYLE parser', () => {
  test('parses MLINESTYLE object fields from DXF group codes', () => {
    const content = `0
MLINESTYLE
5
5A
102
{ACAD_REACTORS
330
1F
102
}
330
1F
100
AcDbMlineStyle
2
WALL
70
19
3
Wall style
62
256
420
16777215
51
90
52
45
71
2
49
0.5
62
1
420
255
6
BYLAYER
49
-0.5
62
3
420
65535
6
DASHED
0
ENDSEC
0
EOF`.split('\n')

    const scanner = new DxfArrayScanner(content)
    const curr = scanner.next()

    const objects = parseObjects(curr, scanner)

    expect(objects.byName.MLINESTYLE).toHaveLength(1)
    expect(objects.byName.MLINESTYLE[0]).toMatchObject<MLineStyleDXFObject>({
      name: 'MLINESTYLE',
      handle: '5A',
      extensions: {
        ACAD_REACTORS: [{ code: 330, value: '1F' }],
      },
      ownerObjectId: '1F',
      subclassMarker: 'AcDbMlineStyle',
      styleName: 'WALL',
      flags: 19,
      description: 'Wall style',
      fillColor: 16777215,
      fillColorIndex: 256,
      startAngle: 90,
      endAngle: 45,
      elementCount: 2,
      elements: [
        { offset: 0.5, color: 255, colorIndex: 1, lineType: 'BYLAYER' },
        { offset: -0.5, color: 65535, colorIndex: 3, lineType: 'DASHED' },
      ],
    })
  })
})
