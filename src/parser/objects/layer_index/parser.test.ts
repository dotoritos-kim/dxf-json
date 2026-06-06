import { describe, expect, test } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseObjects } from '../parser.ts'
import type { LayerIndexDXFObject } from './types.ts'

describe('LAYER_INDEX parser', () => {
  test('parses LAYER_INDEX object fields from DXF group codes', () => {
    const content = `0
LAYER_INDEX
5
2D
102
{ACAD_REACTORS
330
1F
102
}
330
2B
100
AcDbIndex
40
2460312.5
100
AcDbLayerIndex
8
A-WALL
360
90
90
2
8
A-DOOR
360
91
90
5
0
ENDSEC
0
EOF`.split('\n')

    const scanner = new DxfArrayScanner(content)
    const curr = scanner.next()

    const objects = parseObjects(curr, scanner)

    expect(objects.byName.LAYER_INDEX).toHaveLength(1)
    expect(objects.byName.LAYER_INDEX[0]).toMatchObject<LayerIndexDXFObject>({
      name: 'LAYER_INDEX',
      handle: '2D',
      extensions: {
        ACAD_REACTORS: [{ code: 330, value: '1F' }],
      },
      ownerObjectId: '2B',
      indexSubclassMarker: 'AcDbIndex',
      timeStamp: 2460312.5,
      subclassMarker: 'AcDbLayerIndex',
      layerNames: ['A-WALL', 'A-DOOR'],
      idBufferIds: ['90', '91'],
      idBufferEntryCounts: [2, 5],
    })
  })
})
