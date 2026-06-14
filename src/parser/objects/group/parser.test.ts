import { describe, expect, test } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseObjects } from '../parser.ts'
import type { GroupDXFObject } from './types.ts'

describe('GROUP parser', () => {
  test('parses GROUP object fields from DXF group codes', () => {
    const content = `0
GROUP
5
2A
102
{ACAD_REACTORS
330
1F
102
}
330
2B
100
AcDbGroup
300
Test group
70
1
71
0
340
AA
340
AB
0
ENDSEC
0
EOF`.split('\n')

    const scanner = new DxfArrayScanner(content)
    const curr = scanner.next()

    const objects = parseObjects(curr, scanner)

    expect(objects.byName.GROUP).toHaveLength(1)
    expect(objects.byName.GROUP[0]).toMatchObject<GroupDXFObject>({
      name: 'GROUP',
      handle: '2A',
      extensions: {
        ACAD_REACTORS: [{ code: 330, value: '1F' }],
      },
      ownerObjectId: '2B',
      subclassMarker: 'AcDbGroup',
      description: 'Test group',
      isUnnamed: true,
      isSelectable: false,
      entityIds: ['AA', 'AB'],
    })
  })
})
