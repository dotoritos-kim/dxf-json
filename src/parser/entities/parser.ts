import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'
import { ensureHandle } from '../shared/ensureHandle.ts'
import { isMatched } from '../shared/isMatched.ts'

import { ArcEntityParser } from './arc/parser.ts'
import { ArcDimensionParser } from './arc_dimension/parser.ts'
import { AttDefEntityParser } from './attdef/parser.ts'
import { AttributeEntityParser } from './attribute/parser.ts'
import { BodyEntityParser } from './body/parser.ts'
import { CircleEntityParser } from './circle/parser.ts'
import { DimensionParser } from './dimension/parser.ts'
import { EllipseEntityParser } from './ellipse/parser.ts'
import { FaceEntityParser } from './face/parser.ts'
import { ImageEntityParser } from './image/parser.ts'
import { InsertEntityParser } from './insert/parser.ts'
import { LeaderEntityParser } from './leader/parser.ts'
import { LineEntityParser } from './line/parser.ts'
import { LWPolylineParser } from './lwpolyline/parser.ts'
import { MeshEntityParser } from './mesh/parser.ts'
import { MLineEntityParser } from './mline/parser.ts'
import { MTextEntityParser } from './mtext/parser.ts'
import { MultiLeaderEntityParser } from './multileader/parser.ts'
import { PointEntityParser } from './point/parser.ts'
import { PolylineParser } from './polyline/parser.ts'
import { RayParser } from './ray/parser.ts'
import { RegionEntityParser } from './region/parser.ts'
import { SectionEntityParser } from './section/parser.ts'
import { SolidEntityParser } from './solid/parser.ts'
import { Solid3DEntityParser } from './solid3d/parser.ts'
import { SplineEntityParser } from './spline/parser.ts'
import { TextEntityParser } from './text/parser.ts'
import { ToleranceEntityParser } from './tolerance/parser.ts'
import { HatchEntityParser } from './hatch/parser.ts'
import { VertexParser } from './vertex/parser.ts'
import { ViewportParser } from './viewport/parser.ts'
import { WipeoutEntityParser } from './wipeout/parser.ts'
import { XLineEntityParser } from './xline/parser.ts'
import { CommonDxfEntity } from './shared.ts'

const Parsers = Object.fromEntries(
  [
    ArcEntityParser,
    ArcDimensionParser,
    AttDefEntityParser,
    AttributeEntityParser,
    BodyEntityParser,
    CircleEntityParser,
    DimensionParser,
    EllipseEntityParser,
    FaceEntityParser,
    ImageEntityParser,
    InsertEntityParser,
    LeaderEntityParser,
    LineEntityParser,
    LWPolylineParser,
    MeshEntityParser,
    MLineEntityParser,
    MTextEntityParser,
    MultiLeaderEntityParser,
    PointEntityParser,
    PolylineParser,
    RayParser,
    RegionEntityParser,
    SectionEntityParser,
    SolidEntityParser,
    Solid3DEntityParser,
    SplineEntityParser,
    TextEntityParser,
    ToleranceEntityParser,
    HatchEntityParser,
    VertexParser,
    ViewportParser,
    WipeoutEntityParser,
    XLineEntityParser,
  ].map((parser) => [parser.ForEntityName, new parser()]),
)

/**
 * Is called after the parser first reads the 0:ENTITIES group. The scanner
 * should be on the start of the first entity already.
 */
export function parseEntities(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): CommonDxfEntity[] {
  let entities: any[] = []

  while (!isMatched(curr, 0, 'EOF')) {
    if (curr.code === 0) {
      // BLOCK 섹션 안에 ENTITY 섹션이 있을 수도 있고
      // ENTITY 섹션만 따로 있을 수도 있음
      // BLOCK 섹션 안에 들어있는 ENTITY는 ENDBLK으로 끝남
      if (curr.value === 'ENDBLK' || curr.value === 'ENDSEC') {
        scanner.rewind()
        break
      }

      const handler = Parsers[curr.value]
      if (handler) {
        const entityType = curr.value
        curr = scanner.next()

        const entity = handler.parseEntity(scanner, curr) as any
        entity.type = entityType
        ensureHandle(entity)
        entities.push(entity)
      } else if (scanner.debug) {
        console.warn(`Unsupported ENTITY type: ${curr.value}`)
      }
    }

    curr = scanner.next()
  }
  return entities
}
