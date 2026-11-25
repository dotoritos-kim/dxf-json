import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import {
  createParser,
  DXFParserSnippet,
  Identity,
  PointParser,
  ToBoolean,
  Trim,
} from '../../shared/parserGenerator.ts'
import { CommonEntitySnippets, createLongStringSnippet } from '../shared.ts'
import type {
  ExtrudedSurfaceEntity,
  LoftedSurfaceEntity,
  NurbSurfaceEntity,
  PlaneSurfaceEntity,
  RevolvedSurfaceEntity,
  SurfaceEntity,
  SweptSurfaceEntity,
} from './types.ts'

/** Reads following `310` chunks and concatenates them into one hex string */
function readBinaryChunks(scanner: DxfArrayScanner): string {
  let data = ''
  let next = scanner.next()
  while (next.code === 310) {
    data += next.value
    next = scanner.next()
  }
  scanner.rewind()
  return data
}

/**
 * `90`(size of binary data) followed by consecutive `310` chunks.
 * size goes to `entity[sizeName]`, data goes to `entity[dataName]`.
 */
function binaryBlob(sizeName: string, dataName: string): DXFParserSnippet {
  return {
    code: 90,
    name: sizeName,
    parser(curr, scanner, entity) {
      entity[dataName] = readBinaryChunks(scanner)
      return curr.value
    },
  }
}

function matrix(code: number, name: string): DXFParserSnippet {
  return { code, name, parser: Identity, isMultiple: true }
}

function value(
  code: number,
  name: string,
  parser: DXFParserSnippet['parser'] = Identity,
): DXFParserSnippet {
  return { code, name, parser }
}

const SubclassMarker: DXFParserSnippet = {
  code: 100,
  name: 'surfaceSubclassMarker',
  parser: Trim,
}

/**
 * Snippets of `AcDbModelerGeometry` + `AcDbSurface` (shared by all surfaces).
 * NOTE: snippets are consumed as a stack, so file order is reversed here.
 *
 * Subclass-specific snippets live in a separate (pushed) context
 * so that they take priority after the `AcDbSurface` marker,
 * because codes like 70, 90, 290, 310 collide with the base/common ones.
 */
function createSurfaceSnippets(
  subclassSnippets: DXFParserSnippet[],
): DXFParserSnippet[] {
  return [
    // --- context: after `100 AcDbSurface`
    ...subclassSnippets,
    value(72, 'vIsolineCount'),
    value(71, 'uIsolineCount'),
    // --- context: entity header + AcDbModelerGeometry
    {
      code: 100, // AcDbSurface
      name: 'subclassMarker',
      parser: Trim,
      pushContext: true,
    },
    value(2, 'guid'),
    value(290, 'hasRevisionGuid', ToBoolean),
    ...createLongStringSnippet('data'),
    value(70, 'version'),
    { code: 100 }, // AcDbModelerGeometry
    value(350, 'historyObjectSoftId'),
    ...CommonEntitySnippets,
  ]
}

const SweepOptionSnippets: DXFParserSnippet[] = [
  value(11, 'referenceVectorForTwist', PointParser),
  value(296, 'isPathEntityTransformComputed', ToBoolean),
  value(295, 'isSweepEntityTransformComputed', ToBoolean),
  value(294, 'isBasePointSet', ToBoolean),
  value(293, 'isBanked', ToBoolean),
  value(292, 'isAlignedToStart', ToBoolean),
  value(70, 'sweepAlignment'),
  value(290, 'isSolid', ToBoolean),
  matrix(47, 'pathEntityTransform'),
  matrix(46, 'sweepEntityTransform'),
  value(49, 'alignAngle'),
  value(48, 'scaleFactor'),
  value(45, 'twistAngle'),
  value(44, 'draftEndDistance'),
  value(43, 'draftStartDistance'),
  value(42, 'draftAngle'),
]

const ExtrudedSurfaceSnippets: DXFParserSnippet[] = [
  ...SweepOptionSnippets,
  matrix(40, 'transform'),
  value(10, 'sweepVector', PointParser),
  binaryBlob('sweepEntityDataSize', 'sweepEntityData'),
  value(90, 'classId'),
  SubclassMarker,
]

const SweptSurfaceSnippets: DXFParserSnippet[] = [
  ...SweepOptionSnippets,
  matrix(41, 'pathEntityTransformMatrix'),
  matrix(40, 'sweepEntityTransformMatrix'),
  binaryBlob('pathEntityDataSize', 'pathEntityData'),
  value(90, 'pathEntityId'),
  binaryBlob('sweepEntityDataSize', 'sweepEntityData'),
  value(90, 'sweepEntityId'),
  SubclassMarker,
]

const RevolvedSurfaceSnippets: DXFParserSnippet[] = [
  value(291, 'isCloseToAxis', ToBoolean),
  value(290, 'isSolid', ToBoolean),
  value(46, 'twistAngle'),
  value(45, 'draftEndDistance'),
  value(44, 'draftStartDistance'),
  value(43, 'draftAngle'),
  matrix(42, 'transform'),
  value(41, 'startAngle'),
  value(40, 'revolveAngle'),
  value(11, 'axisVector', PointParser),
  value(10, 'axisPoint', PointParser),
  binaryBlob('revolveEntityDataSize', 'revolveEntityData'),
  value(90, 'revolveEntityId'),
  SubclassMarker,
]

const LoftedSurfaceSnippets: DXFParserSnippet[] = [
  value(296, 'isVirtualGuide', ToBoolean),
  value(295, 'isRuled', ToBoolean),
  value(294, 'isClosed', ToBoolean),
  value(293, 'isSimpleSurfaces', ToBoolean),
  value(292, 'isAlignDirection', ToBoolean),
  value(291, 'isNoTwist', ToBoolean),
  value(290, 'isArcLengthParameterization', ToBoolean),
  value(44, 'endDraftMagnitude'),
  value(43, 'startDraftMagnitude'),
  value(42, 'endDraftAngle'),
  value(41, 'startDraftAngle'),
  value(70, 'planeNormalLoftingType'),
  {
    // cross sections / guides / path are stored as (90 size, 310 data...) pairs
    code: 90,
    name: 'entityData',
    parser(curr, scanner) {
      return { size: curr.value, data: readBinaryChunks(scanner) }
    },
    isMultiple: true,
  },
  matrix(40, 'transform'),
  SubclassMarker,
]

function createSurfaceParserClass<T>(
  entityName: string,
  subclassSnippets: DXFParserSnippet[],
) {
  const snippets = createSurfaceSnippets(subclassSnippets)

  return class {
    static ForEntityName = entityName
    readonly parser = createParser(snippets)

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): T {
      const entity = {} as any
      this.parser(curr, scanner, entity)
      // temporary fields of createLongStringSnippet
      delete entity._code1text
      delete entity._code3text
      return entity as T
    }
  }
}

export const SurfaceEntityParser = createSurfaceParserClass<SurfaceEntity>(
  'SURFACE',
  [],
)

export const PlaneSurfaceEntityParser =
  createSurfaceParserClass<PlaneSurfaceEntity>('PLANESURFACE', [
    value(90, 'classId'),
    SubclassMarker,
  ])

export const NurbSurfaceEntityParser =
  createSurfaceParserClass<NurbSurfaceEntity>('NURBSURFACE', [SubclassMarker])

export const ExtrudedSurfaceEntityParser =
  createSurfaceParserClass<ExtrudedSurfaceEntity>(
    'EXTRUDEDSURFACE',
    ExtrudedSurfaceSnippets,
  )

export const SweptSurfaceEntityParser =
  createSurfaceParserClass<SweptSurfaceEntity>(
    'SWEPTSURFACE',
    SweptSurfaceSnippets,
  )

export const RevolvedSurfaceEntityParser =
  createSurfaceParserClass<RevolvedSurfaceEntity>(
    'REVOLVEDSURFACE',
    RevolvedSurfaceSnippets,
  )

export const LoftedSurfaceEntityParser =
  createSurfaceParserClass<LoftedSurfaceEntity>(
    'LOFTEDSURFACE',
    LoftedSurfaceSnippets,
  )
