import {
  type DXFParserSnippet,
  Identity,
  ToBoolean,
} from '../../shared/parserGenerator.ts'
import { CommonObjectSnippets } from '../shared.ts'

export const MLeaderStyleSnippets: DXFParserSnippet[] = [
  {
    code: 179,
    name: 'unknown1',
    parser: Identity,
  },
  {
    code: 170,
    name: 'contentType',
    parser: Identity,
  },
  {
    code: 171,
    name: 'drawMLeaderOrderType',
    parser: Identity,
  },
  {
    code: 172,
    name: 'drawLeaderOrderType',
    parser: Identity,
  },
  {
    code: 90,
    name: 'maxLeaderSegmentPoints',
    parser: Identity,
  },
  {
    code: 40,
    name: 'firstSegmentAngleConstraint',
    parser: Identity,
  },
  {
    code: 41,
    name: 'secondSegmentAngleConstraint',
    parser: Identity,
  },
  {
    code: 173,
    name: 'leaderLineType',
    parser: Identity,
  },
  {
    code: 91,
    name: 'leaderLineColor',
    parser: Identity,
  },
  {
    code: 340,
    name: 'leaderLineTypeId',
    parser: Identity,
  },
  {
    code: 92,
    name: 'leaderLineWeight',
    parser: Identity,
  },
  {
    code: 290,
    name: 'landingEnabled',
    parser: ToBoolean,
  },
  {
    code: 42,
    name: 'landingGap',
    parser: Identity,
  },
  {
    code: 291,
    name: 'doglegEnabled',
    parser: ToBoolean,
  },
  {
    code: 43,
    name: 'doglegLength',
    parser: Identity,
  },
  {
    code: 3,
    name: 'description',
    parser: Identity,
  },
  {
    code: 341,
    name: 'arrowheadId',
    parser: Identity,
  },
  {
    code: 44,
    name: 'arrowheadSize',
    parser: Identity,
  },
  {
    code: 300,
    name: 'defaultMTextContents',
    parser: Identity,
  },
  {
    code: 342,
    name: 'textStyleId',
    parser: Identity,
  },
  {
    code: 174,
    name: 'textLeftAttachmentType',
    parser: Identity,
  },
  {
    code: 175,
    name: 'textAngleType',
    parser: Identity,
  },
  {
    code: 176,
    name: 'textAlignmentType',
    parser: Identity,
  },
  {
    code: 178,
    name: 'textRightAttachmentType',
    parser: Identity,
  },
  {
    code: 93,
    name: 'textColor',
    parser: Identity,
  },
  {
    code: 45,
    name: 'textHeight',
    parser: Identity,
  },
  {
    code: 292,
    name: 'textFrameEnabled',
    parser: ToBoolean,
  },
  {
    code: 297,
    name: 'textAlignAlwaysLeft',
    parser: ToBoolean,
  },
  {
    code: 46,
    name: 'alignSpace',
    parser: Identity,
  },
  {
    code: 343,
    name: 'blockContentId',
    parser: Identity,
  },
  {
    code: 94,
    name: 'blockContentColor',
    parser: Identity,
  },
  {
    code: 47,
    name: 'blockContentScale.x',
    parser: Identity,
  },
  {
    code: 49,
    name: 'blockContentScale.y',
    parser: Identity,
  },
  {
    code: 140,
    name: 'blockContentScale.z',
    parser: Identity,
  },
  {
    code: 293,
    name: 'blockContentScaleEnabled',
    parser: ToBoolean,
  },
  {
    code: 141,
    name: 'blockContentRotation',
    parser: Identity,
  },
  {
    code: 294,
    name: 'blockContentRotationEnabled',
    parser: ToBoolean,
  },
  {
    code: 177,
    name: 'blockContentConnectionType',
    parser: Identity,
  },
  {
    code: 142,
    name: 'scale',
    parser: Identity,
  },
  {
    code: 295,
    name: 'overwritePropertyValue',
    parser: ToBoolean,
  },
  {
    code: 296,
    name: 'annotative',
    parser: ToBoolean,
  },
  {
    code: 143,
    name: 'breakGapSize',
    parser: Identity,
  },
  {
    code: 271,
    name: 'textAttachmentDirection',
    parser: Identity,
  },
  {
    code: 272,
    name: 'bottomTextAttachmentDirection',
    parser: Identity,
  },
  {
    code: 273,
    name: 'topTextAttachmentDirection',
    parser: Identity,
  },
  {
    code: 298,
    name: 'unknown2',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonObjectSnippets,
]
