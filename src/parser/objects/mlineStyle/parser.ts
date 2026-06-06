import type { DXFParserSnippet } from '../../shared/parserGenerator.ts'
import { Identity } from '../../shared/parserGenerator.ts'
import { CommonObjectSnippets } from '../shared.ts'
import type { MLineStyleDXFObject, MLineStyleElement } from './types.ts'
import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'

/**
 * Assign a parsed element-level field into `object.elements`.
 *
 * MLINESTYLE stores per-element data as repeated scalar group codes
 * (49/62/420/6) instead of explicit element blocks. This helper
 * reconstructs element objects by filling the first element that does
 * not yet have the target field, then creating a new element when all
 * existing ones already contain that field.
 *
 * Example parse order:
 * - offset(49), offset(49), color(420), color(420)
 * - becomes:
 *   [{ offset: ... , color: ... }, { offset: ... , color: ... }]
 */
function assignElementField<K extends keyof MLineStyleElement>(
  object: Partial<MLineStyleDXFObject>,
  field: K,
  value: NonNullable<MLineStyleElement[K]>,
) {
  if (!object.elements) {
    object.elements = []
  }

  const target = object.elements.find((element) => element[field] === undefined)
  if (target) {
    target[field] = value
    return
  }

  object.elements.push({ [field]: value } as Pick<MLineStyleElement, K>)
}

/**
 * Parse group code 6 (element line type name).
 *
 * This value belongs to an MLINESTYLE element definition, not the style
 * root object, so it is merged into `object.elements`.
 */
function parseMLineStyleLineType(
  { value }: ScannerGroup,
  _: DxfArrayScanner,
  object: Partial<MLineStyleDXFObject>,
) {
  assignElementField(object, 'lineType', value)
}

/**
 * Parse group code 49 (element offset).
 *
 * Offsets are per-element distances from the MLINE centerline and are
 * stored alongside the matching color/linetype fields in `elements`.
 */
function parseMLineStyleOffset(
  { value }: ScannerGroup,
  _: DxfArrayScanner,
  object: Partial<MLineStyleDXFObject>,
) {
  assignElementField(object, 'offset', value)
}

/**
 * Parse group code 62 (ACI color index).
 *
 * In MLINESTYLE, code 62 is overloaded:
 * - first occurrence before any element data => style `fillColorIndex`
 * - subsequent occurrences => element `colorIndex`
 *
 * We decide by checking whether fill color has been assigned and whether
 * any element parsing has started.
 */
function parseMLineStyleColor(
  { value }: ScannerGroup,
  _: DxfArrayScanner,
  object: Partial<MLineStyleDXFObject>,
) {
  // DXF group code 62 is overloaded in MLINESTYLE:
  // first usage is fillColorIndex, repeated usages are element colorIndex.
  if (object.fillColorIndex === undefined && !object.elements?.length) {
    object.fillColorIndex = value
    return
  }

  assignElementField(object, 'colorIndex', value)
}

/**
 * Parse group code 420 (true color, 24-bit RGB integer).
 *
 * Like code 62, code 420 is overloaded in MLINESTYLE:
 * - first occurrence before element data => style `fillColor`
 * - subsequent occurrences => element `color`
 */
function parseMLineStyleTrueColor(
  { value }: ScannerGroup,
  _: DxfArrayScanner,
  object: Partial<MLineStyleDXFObject>,
) {
  // Group code 420 is also overloaded in MLINESTYLE:
  // first usage is fillColor, repeated usages are element colors.
  if (object.fillColor === undefined && !object.elements?.length) {
    object.fillColor = value
    return
  }

  assignElementField(object, 'color', value)
}

/**
 * Parser snippets for the AcDbMlineStyle object.
 *
 * Repeated element-related group codes are marked `isMultiple: true`
 * so the parser invokes the handlers for every occurrence and allows us
 * to rebuild the full `elements` array.
 */
export const MLineStyleSnippets: DXFParserSnippet[] = [
  {
    code: 6,
    parser: parseMLineStyleLineType,
    isMultiple: true,
  },
  {
    code: 62,
    parser: parseMLineStyleColor,
    isMultiple: true,
  },
  {
    code: 420,
    parser: parseMLineStyleTrueColor,
    isMultiple: true,
  },
  {
    code: 49,
    parser: parseMLineStyleOffset,
    isMultiple: true,
  },
  {
    code: 71,
    name: 'elementCount',
    parser: Identity,
  },
  {
    code: 52,
    name: 'endAngle',
    parser: Identity,
  },
  {
    code: 51,
    name: 'startAngle',
    parser: Identity,
  },
  {
    code: 3,
    name: 'description',
    parser: Identity,
  },
  {
    code: 70,
    name: 'flags',
    parser: Identity,
  },
  {
    code: 2,
    name: 'styleName',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonObjectSnippets,
]
