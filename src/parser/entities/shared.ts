import type { ScannerGroup } from '../DxfArrayScanner.ts'
import { parseExtensions } from '../shared/extensions/parser.ts'
import type { PlotStyleType } from '../../consts/plotStyleType.ts'
import type { ColorIndex, ColorInstance } from '../../types/color.ts'
import {
  type DXFParserSnippet,
  Identity,
  ToBoolean,
} from '../shared/parserGenerator.ts'
import { XDataParserSnippets } from '../shared/xdata/parser.ts'
import type { XData } from '../shared/xdata/types.ts'

export interface CommonDxfEntity {
  type: string
  handle: string
  ownerBlockRecordSoftId?: string
  isInPaperSpace?: boolean
  layer: string
  lineType?: string
  materialObjectHardId?: string
  colorIndex?: ColorIndex
  lineweight?: number // 문서에는 무조건 있다고 하는데, 실제로는 없는 경우 많음
  /** @default 1 If not presented */
  lineTypeScale?: number
  isVisible?: boolean
  /**
   * Number of bytes in the proxy entity graphics represented in the sub-sequent `310` groups,
   * which are binary chunk records.
   *
   * Parsed by group code `92` or `160`. Later one seems to be generated from 64-bit workstation.
   *
   * @see https://ljh4timm.home.xs4all.nl/libdxf/doxygen/structdxf__mline__struct.html#a09e8e35e67156951f6437a63e1338081
   */
  proxyByte?: number
  /**
   * Arbitrary binary chunks with same representation and limits as 1004 group codes:
   * hexadecimal strings of up to 254 characters represent data chunks of up to 127 bytes
   *
   * In `dxf-json`, these chunks are concatenated into a single string.
   *
   * Parsed bygroup code `310`.
   *
   * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=GUID-3F0380A5-1C15-464D-BC66-2C5F094BCFB9
   */
  proxyEntity?: string
  /**
   * A 24-bit color value that should be dealt with in terms of bytes with values of 0 to 255.
   *
   * The lowest byte is the blue value, the middle byte is the green value, and the third byte is the red value. The top byte is always 0.
   *
   * The group code cannot be used by custom entities for their own data because
   * the group code is reserved for AcDbEntity, class-level color data and AcDbEntity, class-level transparency data
   *
   * @note From v0.9.0, if there is no explicit 420 group code, no fallback will be given.
   */
  color?: ColorInstance
  /**
   * The group code cannot be used by custom entities for their own data because
   * the group code is reserved for AcDbEntity, class-level color data and AcDbEntity, class-level transparency data
   */
  colorName?: string
  transparency?: number
  plotStyleType?: PlotStyleType
  plotStyleHardId?: string
  shadowMode?: ShadowMode
  xdata?: XData[]
  /**
   * Application specific extension by their application-name.
   * As it differs by application, you have to parse by your own.
   * Note that group codes 102 for brackets are not included in the array.
   * */
  extensions?: Record<string, ScannerGroup[]>
}

export enum ShadowMode {
  CAST_AND_RECEIVE = 0,
  CAST = 1,
  RECEIVE = 2,
  IGNORE = 3,
}

// 이게 top에 와야함. 우선순위가 더 높다.
export const CommonEntitySnippets: DXFParserSnippet[] = [
  ...XDataParserSnippets,
  {
    code: 284,
    name: 'shadowMode',
    parser: Identity,
  },
  {
    code: 390,
    name: 'plotStyleHardId',
    parser: Identity,
  },
  {
    code: 380,
    name: 'plotStyleType',
    parser: Identity,
  },
  {
    code: 440,
    name: 'transparency',
    parser: Identity,
  },
  {
    code: 430,
    name: 'colorName',
    parser: Identity,
  },
  {
    code: 420,
    name: 'color',
    parser: Identity,
  },
  {
    code: 310,
    name: 'proxyEntity',
    isMultiple: true,
    isReducible: true,
    parser: (curr, _, entity) => (entity.proxyEntity ?? '') + curr.value,
  },
  {
    code: [92, 160],
    name: 'proxyByte',
    parser: Identity,
  },
  {
    code: 60,
    name: 'isVisible',
    parser: ToBoolean,
  },
  {
    code: 48,
    name: 'lineTypeScale',
    parser: Identity,
  },
  {
    code: 370,
    name: 'lineweight',
    parser: Identity,
  },
  {
    code: 62,
    name: 'colorIndex',
    parser: Identity,
  },
  {
    code: 347,
    name: 'materialObjectHardId',
    parser: Identity,
  },
  {
    code: 6,
    name: 'lineType',
    parser: Identity,
  },
  {
    code: 8,
    name: 'layer',
    parser: Identity,
  },
  {
    code: 410,
    name: 'layoutTabName',
    parser: Identity,
  },
  {
    code: 67,
    name: 'isInPaperSpace',
    parser: ToBoolean,
  },
  {
    code: 100, // AcDbEntity를 소모시키기 위함
  },
  {
    code: 330,
    name: 'ownerBlockRecordSoftId',
    parser: Identity,
  },
  {
    code: 102, // {ACAD_XDICTIONARY
    parser: parseExtensions,
  },
  {
    code: 102, // {ACAD_REACTORS
    parser: parseExtensions,
  },
  {
    code: 102, // {application_name
    parser: parseExtensions,
  },
  {
    code: 5,
    name: 'handle',
    parser: Identity,
  },
]

/**
 * This embeds the text separated in mulitple code 1 and code 3.
 * Note that this inject _code3text to ensure the order,
 * and this shouldn't be used for public.
 *
 * @internal
 */
export function createLongStringSnippet(fieldName: string): DXFParserSnippet[] {
  return [
    {
      code: 3,
      name: fieldName,
      parser(curr, _, entity) {
        entity._code3text = (entity._code3text ?? '') + curr.value
        return entity._code3text + (entity._code1text ?? '')
      },
      isMultiple: true,
      isReducible: true,
    },
    {
      code: 1,
      name: fieldName,
      parser(curr, _, entity) {
        entity._code1text = curr.value
        return (entity._code3text ?? '') + entity._code1text
      },
    },
  ]
}
