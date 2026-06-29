import { describe, expect, test } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseObjects } from '../parser.ts'
import type { LayerFilterDXFObject } from './types.ts'

describe('LAYER_FILTER parser', () => {
  test('parses LAYER_FILTER object fields from DXF group codes', () => {
    const content = `0
LAYER_FILTER
5
2C
102
{ACAD_REACTORS
330
1F
102
}
330
2B
100
AcDbFilter
100
AcDbLayerFilter
8
A-WALL
8
A-DOOR
0
ENDSEC
0
EOF`.split('\n')

    const scanner = new DxfArrayScanner(content)
    const curr = scanner.next()

    const objects = parseObjects(curr, scanner)

    expect(objects.byName.LAYER_FILTER).toHaveLength(1)
    expect(objects.byName.LAYER_FILTER[0]).toMatchObject<LayerFilterDXFObject>({
      name: 'LAYER_FILTER',
      handle: '2C',
      extensions: {
        ACAD_REACTORS: [{ code: 330, value: '1F' }],
      },
      ownerObjectId: '2B',
      filterSubclassMarker: 'AcDbFilter',
      subclassMarker: 'AcDbLayerFilter',
      layerNames: ['A-WALL', 'A-DOOR'],
    })
  })
})
