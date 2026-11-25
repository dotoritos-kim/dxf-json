import { describe, expect, test } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { parseObjects } from '../parser.ts'
import type { MLeaderStyleDXFObject } from './types.ts'

describe('MLEADERSTYLE parser', () => {
  test('parses documented object fields', () => {
    const content = `0
MLEADERSTYLE
5
12E
102
{ACAD_REACTORS
330
12D
102
}
330
12D
100
AcDbMLeaderStyle
179
2
170
2
171
1
172
0
90
2
40
0.25
41
0.5
173
1
91
-1056964608
340
14
92
-2
290
1
42
2.0
291
1
43
8.0
3
Standard
341
11
44
4.0
300
Default text
342
15
174
1
175
2
176
0
178
6
93
256
45
4.0
292
0
297
1
46
4.0
343
16
94
63
47
1.0
49
1.5
140
2.0
293
1
141
0.75
294
1
177
0
142
1.0
295
0
296
1
143
3.75
271
0
272
9
273
10
298
1
0
ENDSEC
0
EOF`.split('\n')
    const scanner = new DxfArrayScanner(content)
    const curr = scanner.next()

    const objects = parseObjects(curr, scanner)

    expect(objects.byName.MLEADERSTYLE).toHaveLength(1)
    expect(objects.byName.MLEADERSTYLE[0]).toMatchObject<MLeaderStyleDXFObject>({
      name: 'MLEADERSTYLE',
      handle: '12E',
      extensions: {
        ACAD_REACTORS: [{ code: 330, value: '12D' }],
      },
      ownerObjectId: '12D',
      subclassMarker: 'AcDbMLeaderStyle',
      unknown1: 2,
      contentType: 2,
      drawMLeaderOrderType: 1,
      drawLeaderOrderType: 0,
      maxLeaderSegmentPoints: 2,
      firstSegmentAngleConstraint: 0.25,
      secondSegmentAngleConstraint: 0.5,
      leaderLineType: 1,
      leaderLineColor: -1056964608,
      leaderLineTypeId: '14',
      leaderLineWeight: -2,
      landingEnabled: true,
      landingGap: 2,
      doglegEnabled: true,
      doglegLength: 8,
      description: 'Standard',
      arrowheadId: '11',
      arrowheadSize: 4,
      defaultMTextContents: 'Default text',
      textStyleId: '15',
      textLeftAttachmentType: 1,
      textAngleType: 2,
      textAlignmentType: 0,
      textRightAttachmentType: 6,
      textColor: 256,
      textHeight: 4,
      textFrameEnabled: false,
      textAlignAlwaysLeft: true,
      alignSpace: 4,
      blockContentId: '16',
      blockContentColor: 63,
      blockContentScale: { x: 1, y: 1.5, z: 2 },
      blockContentScaleEnabled: true,
      blockContentRotation: 0.75,
      blockContentRotationEnabled: true,
      blockContentConnectionType: 0,
      scale: 1,
      overwritePropertyValue: false,
      annotative: true,
      breakGapSize: 3.75,
      textAttachmentDirection: 0,
      bottomTextAttachmentDirection: 9,
      topTextAttachmentDirection: 10,
      unknown2: true,
    })
  })

  test('parses AutoCAD-style object with XDATA and missing optional handles', () => {
    const content = `0
MLEADERSTYLE
5
3452D
102
{ACAD_XDICTIONARY
360
34566
102
}
102
{ACAD_REACTORS
330
3452C
102
}
330
3452C
100
AcDbMLeaderStyle
170
2
171
1
172
0
90
2
40
0.0
41
0.0
173
1
91
-1056964608
340
12
92
-2
290
1
42
0.09
291
1
43
0.36
3
Standard
44
0.18
300

342
F
174
1
178
6
175
1
176
0
93
-1056964608
45
0.18
292
0
297
0
46
0.18
94
-1056964608
47
1.0
49
1.0
140
1.0
293
1
141
0.0
294
1
177
0
142
1.0
295
0
296
0
143
0.125
1001
ACAD_MLEADERVER
1070
2
0
MLEADERSTYLE
5
12E
330
12D
100
AcDbMLeaderStyle
3
Annotative
296
1
0
ENDSEC
0
EOF`.split('\n')
    const scanner = new DxfArrayScanner(content)
    const objects = parseObjects(scanner.next(), scanner)

    expect(objects.byName.MLEADERSTYLE).toHaveLength(2)
    const [first, second] = objects.byName
      .MLEADERSTYLE as MLeaderStyleDXFObject[]
    expect(first).toMatchObject({
      handle: '3452D',
      ownerObjectId: '3452C',
      extensions: {
        ACAD_XDICTIONARY: [{ code: 360, value: '34566' }],
        ACAD_REACTORS: [{ code: 330, value: '3452C' }],
      },
      description: 'Standard',
      textStyleId: 'F',
      textRightAttachmentType: 6,
      blockContentScale: { x: 1, y: 1, z: 1 },
      breakGapSize: 0.125,
      xdata: [{ appName: 'ACAD_MLEADERVER', value: [2] }],
    })
    expect(first.arrowheadId).toBeUndefined()
    expect(first.blockContentId).toBeUndefined()
    expect(second).toMatchObject({
      handle: '12E',
      description: 'Annotative',
      annotative: true,
    })
    expect(second.xdata).toBeUndefined()
  })
})
