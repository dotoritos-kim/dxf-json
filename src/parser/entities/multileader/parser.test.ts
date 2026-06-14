import { describe, expect, test } from 'vitest'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { MultiLeaderEntityParser } from './parser.ts'

describe('MULTILEADER', () => {
  test('parses native context data after proxy graphics', () => {
    const content = `0
MULTILEADER
5
168
330
1F
100
AcDbEntity
8
0
160
4
310
ABCD
100
AcDbMLeader
270
2
300
CONTEXT_DATA{
40
1.0
10
314.11285266458
20
159.24939045629
30
0.0
41
4.0
290
1
304
{MLeader}
11
0.0
21
0.0
31
1.0
12
326.9709699906373
22
161.2821326118152
32
0.0
170
1
302
LEADER{
10
306.11285266458
20
159.24939045629
30
0.0
11
1.0
21
0.0
31
0.0
40
8.0
304
LEADER_LINE{
10
291.78857540927
20
137.91536050157
30
0.0
305
}
303
}
301
}
0
ENDSEC
0
EOF`.split('\n')
    const scanner = new DxfArrayScanner(content)
    const parser = new MultiLeaderEntityParser()

    let curr = scanner.next()
    curr = scanner.next()
    const entity = parser.parseEntity(scanner, curr)

    expect(entity).toMatchObject({
      handle: '168',
      ownerBlockRecordSoftId: '1F',
      layer: '0',
      proxyByte: 4,
      proxyEntity: 'ABCD',
      subclassMarker: 'AcDbMLeader',
      version: 2,
      contentScale: 1,
      contentBasePosition: { x: 314.11285266458, y: 159.24939045629, z: 0 },
      textHeight: 4,
      textContent: '{MLeader}',
      contentType: 2,
      textLineSpacingStyle: 1,
      hasMText: true,
      normal: { x: 0, y: 0, z: 1 },
      textAnchor: {
        x: 326.9709699906373,
        y: 161.2821326118152,
        z: 0,
      },
      leaderSections: [
        {
          lastLeaderLinePoint: {
            x: 306.11285266458,
            y: 159.24939045629,
            z: 0,
          },
          doglegVector: { x: 1, y: 0, z: 0 },
          doglegLength: 8,
          leaderLines: [
            {
              vertices: [{ x: 291.78857540927, y: 137.91536050157, z: 0 }],
            },
          ],
        },
      ],
    })
  })

  test('parses documented common, context, leader node, and leader line fields', () => {
    const content = `0
MULTILEADER
5
200
330
1F
100
AcDbEntity
8
Notes
100
AcDbMLeader
270
2
340
ABC
90
7
170
1
91
256
341
LTYPE
171
30
290
1
291
1
41
6.5
342
ARROW
42
2.5
172
2
343
STYLE
173
1
95
3
174
0
175
2
92
16777215
292
1
344
BLOCK
93
255
10
1
20
2
30
3
43
0.25
176
4
293
1
94
2
345
ARROW2
330
ATTDEF
177
9
44
12
302
Attribute value
294
0
178
1
179
8
271
2
272
1
273
3
300
CONTEXT_DATA{
40
1.25
10
100
20
200
30
0
41
4
140
2
145
0.5
290
1
304
Context text
11
0
21
0
31
1
340
TEXTSTYLE
12
101
22
201
32
0
13
1
23
0
33
0
42
0.75
43
30
45
1.2
170
2
171
5
172
6
90
123
91
456
141
1.1
92
40
291
1
292
1
173
2
293
1
142
20
143
4
294
0
144
10
295
1
296
1
341
BLKCTX
14
0
24
0
34
1
15
110
25
210
35
0
16
1
26
1
36
1
46
1.57
93
77
47
1
47
0
110
0
120
0
130
0
111
1
121
0
131
0
112
0
122
1
132
0
297
0
302
LEADER{
290
1
291
1
10
90
20
190
30
0
11
1
21
0
31
0
12
80
22
180
32
0
13
85
23
185
33
0
90
4
40
8
304
LEADER_LINE{
10
70
20
170
30
0
90
0
11
75
21
175
31
0
12
76
22
176
32
0
91
5
305
}
303
}
301
}
0
ENDSEC
0
EOF`.split('\n')
    const scanner = new DxfArrayScanner(content)
    const parser = new MultiLeaderEntityParser()

    let curr = scanner.next()
    curr = scanner.next()
    const entity = parser.parseEntity(scanner, curr)

    expect(entity).toMatchObject({
      handle: '200',
      ownerBlockRecordSoftId: '1F',
      layer: 'Notes',
      subclassMarker: 'AcDbMLeader',
      version: 2,
      leaderStyleId: 'ABC',
      propertyOverrideFlag: 7,
      leaderLineType: 1,
      leaderLineColor: 256,
      leaderLineTypeId: 'LTYPE',
      leaderLineWeight: 30,
      landingEnabled: true,
      doglegEnabled: true,
      doglegLength: 6.5,
      arrowheadId: 'ARROW',
      arrowheadSize: 2,
      contentType: 2,
      textStyleId: 'TEXTSTYLE',
      textLeftAttachmentType: 1,
      textRightAttachmentType: 3,
      textAngleType: 0,
      textAlignmentType: 2,
      textColor: 123,
      textFrameEnabled: true,
      blockContentId: 'BLKCTX',
      blockContentColor: 255,
      blockContentScale: { x: 1, y: 2, z: 3 },
      blockContentRotation: 0.25,
      blockContentConnectionType: 4,
      annotativeScaleEnabled: true,
      arrowheadOverrides: [{ index: 2, handle: 'ARROW2' }],
      blockAttributes: [
        {
          id: 'ATTDEF',
          index: 9,
          width: 12,
          text: 'Attribute value',
        },
      ],
      textDirectionNegative: false,
      textAlignInIPE: 1,
      textAttachmentPoint: 8,
      textAttachmentDirection: 2,
      bottomTextAttachmentDirection: 1,
      topTextAttachmentDirection: 3,
      contentScale: 1.25,
      contentBasePosition: { x: 100, y: 200, z: 0 },
      hasMText: true,
      textContent: 'Context text',
      normal: { x: 0, y: 0, z: 1 },
      textAnchor: { x: 101, y: 201, z: 0 },
      textDirection: { x: 1, y: 0, z: 0 },
      textRotation: 0.75,
      textWidth: 30,
      textLineSpacingFactor: 1.2,
      textLineSpacingStyle: 2,
      textAttachment: 5,
      textFlowDirection: 6,
      textBackgroundColor: 456,
      textBackgroundScaleFactor: 1.1,
      textBackgroundTransparency: 40,
      textBackgroundColorOn: true,
      textFillOn: true,
      textColumnType: 2,
      textUseAutoHeight: true,
      textColumnWidth: 20,
      textColumnGutterWidth: 4,
      textColumnFlowReversed: false,
      textColumnHeight: 10,
      textUseWordBreak: true,
      hasBlock: true,
      blockContent: {
        blockContentId: 'BLKCTX',
        normal: { x: 0, y: 0, z: 1 },
        position: { x: 110, y: 210, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotation: 1.57,
        color: 77,
        transformationMatrix: [1, 0],
      },
      planeOrigin: { x: 0, y: 0, z: 0 },
      planeXAxisDirection: { x: 1, y: 0, z: 0 },
      planeYAxisDirection: { x: 0, y: 1, z: 0 },
      planeNormalReversed: false,
      leaderSections: [
        {
          lastLeaderLinePointSet: true,
          doglegVectorSet: true,
          lastLeaderLinePoint: { x: 90, y: 190, z: 0 },
          doglegVector: { x: 1, y: 0, z: 0 },
          breaks: [
            {
              start: { x: 80, y: 180, z: 0 },
              end: { x: 85, y: 185, z: 0 },
            },
          ],
          leaderBranchIndex: 4,
          doglegLength: 8,
          leaderLines: [
            {
              vertices: [{ x: 70, y: 170, z: 0 }],
              breakPointIndexes: [0],
              leaderLineIndex: 5,
              breaks: [
                {
                  index: 0,
                  start: { x: 75, y: 175, z: 0 },
                  end: { x: 76, y: 176, z: 0 },
                },
              ],
            },
          ],
        },
      ],
    })
  })
})
