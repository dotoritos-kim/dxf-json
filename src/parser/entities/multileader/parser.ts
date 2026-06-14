import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import { ensurePoint3D } from '../../../utlis.ts'
import type { DXFParserSnippet } from '../../shared/parserGenerator.ts'
import {
  createParser,
  Identity,
  PointParser,
  ToBoolean,
} from '../../shared/parserGenerator.ts'
import { CommonEntitySnippets } from '../shared.ts'
import type {
  MultiLeaderBlockAttribute,
  MultiLeaderBreak,
  MultiLeaderEntity,
  MultiLeaderIndexedHandle,
} from './types.ts'

const DefaultMultiLeaderEntity = {}

const MultiLeaderEntityParserSnippets: DXFParserSnippet[] = [
  {
    code: 300,
    parser: parseContextData,
  },
  {
    code: 270,
    name: 'version',
    parser: Identity,
  },
  {
    code: 340,
    name: 'leaderStyleId',
    parser: Identity,
  },
  {
    code: 90,
    name: 'propertyOverrideFlag',
    parser: Identity,
  },
  {
    code: 170,
    name: 'leaderLineType',
    parser: Identity,
  },
  {
    code: 91,
    name: 'leaderLineColor',
    parser: Identity,
  },
  {
    code: 341,
    name: 'leaderLineTypeId',
    parser: Identity,
  },
  {
    code: 171,
    name: 'leaderLineWeight',
    parser: Identity,
  },
  {
    code: 290,
    name: 'landingEnabled',
    parser: ToBoolean,
  },
  {
    code: 291,
    name: 'doglegEnabled',
    parser: ToBoolean,
  },
  {
    code: [40, 41],
    name: 'doglegLength',
    parser: Identity,
  },
  {
    code: 342,
    name: 'arrowheadId',
    parser: Identity,
  },
  {
    code: 42,
    name: 'arrowheadSize',
    parser: Identity,
  },
  {
    code: 172,
    name: 'contentType',
    parser: Identity,
  },
  {
    code: 343,
    name: 'textStyleId',
    parser: Identity,
  },
  {
    code: 173,
    name: 'textLeftAttachmentType',
    parser: Identity,
  },
  {
    code: 95,
    name: 'textRightAttachmentType',
    parser: Identity,
  },
  {
    code: 174,
    name: 'textAngleType',
    parser: Identity,
  },
  {
    code: 175,
    name: 'textAlignmentType',
    parser: Identity,
  },
  {
    code: 92,
    name: 'textColor',
    parser: Identity,
  },
  {
    code: 292,
    name: 'textFrameEnabled',
    parser: ToBoolean,
  },
  {
    code: 344,
    parser: parseBlockContentId,
  },
  {
    code: 93,
    name: 'blockContentColor',
    parser: Identity,
  },
  {
    code: 10,
    name: 'blockContentScale',
    parser: PointParser,
  },
  {
    code: 43,
    name: 'blockContentRotation',
    parser: Identity,
  },
  {
    code: 176,
    name: 'blockContentConnectionType',
    parser: Identity,
  },
  {
    code: 293,
    name: 'annotativeScaleEnabled',
    parser: ToBoolean,
  },
  {
    code: 94,
    parser: parseArrowheadOverrideIndex,
    isMultiple: true,
  },
  {
    code: 345,
    parser: parseArrowheadOverrideHandle,
    isMultiple: true,
  },
  {
    code: 330,
    parser: parseBlockAttributeId,
    isMultiple: true,
  },
  {
    code: 177,
    parser: parseBlockAttributeIndex,
    isMultiple: true,
  },
  {
    code: 44,
    parser: parseBlockAttributeWidth,
    isMultiple: true,
  },
  {
    code: 302,
    parser: parseBlockAttributeText,
    isMultiple: true,
  },
  {
    code: 294,
    name: 'textDirectionNegative',
    parser: ToBoolean,
  },
  {
    code: 178,
    name: 'textAlignInIPE',
    parser: Identity,
  },
  {
    code: 179,
    name: 'textAttachmentPoint',
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
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonEntitySnippets,
]

function parsePoint(curr: ScannerGroup, scanner: DxfArrayScanner) {
  return ensurePoint3D(PointParser(curr, scanner))
}

function parseBlockContentId(
  curr: ScannerGroup,
  _: DxfArrayScanner,
  entity: any,
) {
  entity.blockContentId = curr.value
  ensureBlockContent(entity).blockContentId = curr.value
}

function parseArrowheadOverrideIndex(
  curr: ScannerGroup,
  _: DxfArrayScanner,
  entity: any,
) {
  entity.arrowheadOverrides ??= []
  entity.arrowheadOverrides.push({ index: curr.value })
}

function parseArrowheadOverrideHandle(
  curr: ScannerGroup,
  _: DxfArrayScanner,
  entity: any,
) {
  ensureLastArrowheadOverride(entity).handle = curr.value
}

function parseBlockAttributeId(
  curr: ScannerGroup,
  _: DxfArrayScanner,
  entity: any,
) {
  entity.blockAttributes ??= []
  entity.blockAttributes.push({ id: curr.value })
}

function parseBlockAttributeIndex(
  curr: ScannerGroup,
  _: DxfArrayScanner,
  entity: any,
) {
  ensureLastBlockAttribute(entity).index = curr.value
}

function parseBlockAttributeWidth(
  curr: ScannerGroup,
  _: DxfArrayScanner,
  entity: any,
) {
  ensureLastBlockAttribute(entity).width = curr.value
}

function parseBlockAttributeText(
  curr: ScannerGroup,
  _: DxfArrayScanner,
  entity: any,
) {
  ensureLastBlockAttribute(entity).text = curr.value
}

/**
 * Parses AcDbMLeader context data. The native MULTILEADER payload wraps most
 * visible geometry and text information in a 300/301 block.
 */
function parseContextData(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
  entity?: any,
): void {
  if (curr.value !== 'CONTEXT_DATA{') return

  let group: ScannerGroup
  while (scanner.hasNext()) {
    group = scanner.next()
    if (group.code === 301) break

    switch (group.code) {
      case 10:
        entity.contentBasePosition = parsePoint(group, scanner)
        break
      case 11:
        entity.normal = parsePoint(group, scanner)
        break
      case 12:
        entity.textAnchor = parsePoint(group, scanner)
        break
      case 13:
        entity.textDirection = parsePoint(group, scanner)
        break
      case 14:
        ensureBlockContent(entity).normal = parsePoint(group, scanner)
        break
      case 15:
        ensureBlockContent(entity).position = parsePoint(group, scanner)
        break
      case 16:
        ensureBlockContent(entity).scale = parsePoint(group, scanner)
        break
      case 40:
        entity.contentScale = group.value
        break
      case 41:
        entity.textHeight = group.value
        break
      case 42:
        entity.textRotation = group.value
        break
      case 43:
        entity.textWidth = group.value
        break
      case 44:
        entity.textHeight = group.value
        break
      case 45:
        entity.textLineSpacingFactor = group.value
        break
      case 46:
        ensureBlockContent(entity).rotation = group.value
        break
      case 47:
        ensureBlockContent(entity).transformationMatrix ??= []
        ensureBlockContent(entity).transformationMatrix?.push(group.value)
        break
      case 90:
        entity.textColor = group.value
        break
      case 91:
        entity.textBackgroundColor = group.value
        break
      case 92:
        entity.textBackgroundTransparency = group.value
        break
      case 93:
        ensureBlockContent(entity).color = group.value
        break
      case 110:
        entity.planeOrigin = parsePoint(group, scanner)
        break
      case 111:
        entity.planeXAxisDirection = parsePoint(group, scanner)
        break
      case 112:
        entity.planeYAxisDirection = parsePoint(group, scanner)
        break
      case 140:
        entity.arrowheadSize = group.value
        break
      case 141:
        entity.textBackgroundScaleFactor = group.value
        break
      case 142:
        entity.textColumnWidth = group.value
        break
      case 143:
        entity.textColumnGutterWidth = group.value
        break
      case 144:
        entity.textColumnHeight = group.value
        break
      case 145:
        entity.landingGap = group.value
        break
      case 170:
        entity.textLineSpacingStyle = group.value
        break
      case 171:
        entity.textAttachment = group.value
        break
      case 172:
        entity.textFlowDirection = group.value
        break
      case 173:
        entity.textColumnType = group.value
        break
      case 290:
        entity.hasMText = group.value
        break
      case 291:
        entity.textBackgroundColorOn = group.value
        break
      case 292:
        entity.textFillOn = group.value
        break
      case 293:
        entity.textUseAutoHeight = group.value
        break
      case 294:
        entity.textColumnFlowReversed = group.value
        break
      case 295:
        entity.textUseWordBreak = group.value
        break
      case 296:
        entity.hasBlock = group.value
        break
      case 297:
        entity.planeNormalReversed = group.value
        break
      case 302:
        if (group.value === 'LEADER{') {
          entity.leaderSections ??= []
          entity.leaderSections.push(parseLeaderSection(group, scanner))
        }
        break
      case 304:
        if (group.value !== 'LEADER_LINE{') {
          entity.textContent = group.value
          entity.contentType ??= 2
        }
        break
      case 340:
        entity.textStyleId = group.value
        break
      case 341:
        entity.blockContentId = group.value
        ensureBlockContent(entity).blockContentId = group.value
        break
      default:
        break
    }
  }
}

function parseLeaderSection(curr: ScannerGroup, scanner: DxfArrayScanner): any {
  if (curr.value !== 'LEADER{') return { leaderLines: [] }

  const section: any = { leaderLines: [] }
  let currentBreak: Partial<MultiLeaderBreak> | undefined
  let group: ScannerGroup
  while (scanner.hasNext()) {
    group = scanner.next()
    if (group.code === 303) {
      pushBreak(section, currentBreak)
      break
    }
    switch (group.code) {
      case 290:
        section.lastLeaderLinePointSet = group.value
        break
      case 291:
        section.doglegVectorSet = group.value
        break
      case 10:
        section.lastLeaderLinePoint = parsePoint(group, scanner)
        break
      case 11:
        section.doglegVector = parsePoint(group, scanner)
        break
      case 12:
        currentBreak ??= {}
        currentBreak.start = parsePoint(group, scanner)
        break
      case 13:
        currentBreak ??= {}
        currentBreak.end = parsePoint(group, scanner)
        pushBreak(section, currentBreak)
        currentBreak = undefined
        break
      case 90:
        section.leaderBranchIndex = group.value
        break
      case 40:
        section.doglegLength = group.value
        break
      case 304:
        if (group.value === 'LEADER_LINE{') {
          section.leaderLines.push(parseLeaderLine(group, scanner))
        }
        break
      default:
        break
    }
  }
  return section
}

function parseLeaderLine(curr: ScannerGroup, scanner: DxfArrayScanner): any {
  if (curr.value !== 'LEADER_LINE{') return { vertices: [] }

  const leaderLine: any = { vertices: [] }
  let currentBreak: Partial<MultiLeaderBreak> | undefined
  let group: ScannerGroup
  while (scanner.hasNext()) {
    group = scanner.next()
    if (group.code === 305) {
      pushBreak(leaderLine, currentBreak)
      break
    }
    switch (group.code) {
      case 10:
        leaderLine.vertices.push(parsePoint(group, scanner))
        break
      case 11:
        currentBreak ??= {}
        currentBreak.start = parsePoint(group, scanner)
        break
      case 12:
        currentBreak ??= {}
        currentBreak.end = parsePoint(group, scanner)
        pushBreak(leaderLine, currentBreak)
        currentBreak = undefined
        break
      case 90:
        leaderLine.breakPointIndexes ??= []
        leaderLine.breakPointIndexes.push(group.value)
        currentBreak ??= {}
        currentBreak.index = group.value
        break
      case 91:
        leaderLine.leaderLineIndex = group.value
        break
      default:
        break
    }
  }
  return leaderLine
}

function pushBreak(target: any, value?: Partial<MultiLeaderBreak>) {
  if (!value?.start && !value?.end) return
  target.breaks ??= []
  target.breaks.push(value)
}

function ensureBlockContent(entity: any) {
  return (entity.blockContent ??= {})
}

function ensureLastArrowheadOverride(entity: any) {
  entity.arrowheadOverrides ??= []
  if (!entity.arrowheadOverrides.length) {
    entity.arrowheadOverrides.push({})
  }
  return entity.arrowheadOverrides[
    entity.arrowheadOverrides.length - 1
  ] as Partial<MultiLeaderIndexedHandle>
}

function ensureLastBlockAttribute(entity: any) {
  entity.blockAttributes ??= []
  if (!entity.blockAttributes.length) {
    entity.blockAttributes.push({})
  }
  return entity.blockAttributes[
    entity.blockAttributes.length - 1
  ] as MultiLeaderBlockAttribute
}

export class MultiLeaderEntityParser {
  static ForEntityName = 'MULTILEADER'
  private parser = createParser(
    MultiLeaderEntityParserSnippets,
    DefaultMultiLeaderEntity,
  )

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any
    this.parser(curr, scanner, entity)
    return entity as MultiLeaderEntity
  }
}
