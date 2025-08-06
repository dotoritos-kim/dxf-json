
export * from "./arc";
export * from "./attdef";
export * from './attribute'
export * from "./body";
export * from "./circle";
export * from "./dimension";
export * from "./ellipse";
export * from './face'
export * from "./hatch";
export * from './image'
export * from "./insert";
export * from "./leader";
export * from "./line";
export * from "./lwpolyline";
export * from './mesh'
export * from "./mtext";
export * from "./point";
export * from "./polyline";
export * from "./ray";
export * from "./region";
export * from "./section";
export * from "./solid";
export * from "./solid3d";
export * from "./spline";
export * from "./text";
export * from "./tolerance";
export * from "./vertex";
export * from "./viewport";
export * from "./wipeout";
export * from "./xline";
export * from "./shared";

import type { DxfArrayScanner, ScannerGroup } from "../DxfArrayScanner";
import { ensureHandle, isMatched } from "../shared";


import { ArcEntityParser } from "./arc";
import { AttDefEntityParser } from "./attdef";
import { AttributeEntityParser } from "./attribute";
import { BodyEntityParser } from "./body";
import { CircleEntityParser } from "./circle";
import { DimensionParser } from "./dimension";
import { EllipseEntityParser } from "./ellipse";
import { FaceEntityParser } from "./face";
import { ImageEntityParser } from "./image";
import { InsertEntityParser } from "./insert";
import { LeaderEntityParser } from "./leader";
import { LineEntityParser } from "./line";
import { LWPolylineParser } from "./lwpolyline";
import { MeshEntityParser } from "./mesh";
import { MTextEntityParser } from "./mtext";
import { PointEntityParser } from "./point";
import { PolylineParser } from "./polyline";
import { RayParser } from "./ray";
import { RegionEntityParser } from "./region";
import { SectionEntityParser } from "./section";
import { SolidEntityParser } from "./solid";
import { Solid3DEntityParser } from "./solid3d";
import { SplineEntityParser } from "./spline";
import { TextEntityParser } from "./text";
import { ToleranceEntityParser } from "./tolerance";
import { HatchEntityParser } from "./hatch";
import { VertexParser } from "./vertex";
import { ViewportParser } from "./viewport";
import { WipeoutEntityParser } from "./wipeout";
import { XLineEntityParser } from "./xline";
import { CommonDxfEntity } from "./shared";

import { MultiLeaderEntityParser } from "./multileader";

const Parsers = Object.fromEntries(
	[
		ArcEntityParser,
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
	].map((parser) => [parser.ForEntityName, new parser()])
);

/**
 * Is called after the parser first reads the 0:ENTITIES group. The scanner
 * should be on the start of the first entity already.
 */
export function parseEntities(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): CommonDxfEntity[] {
  let entities: any[] = [];

  while (!isMatched(curr, 0, "EOF")) {
    if (curr.code === 0) {
      // BLOCK 섹션 안에 ENTITY 섹션이 있을 수도 있고
      // ENTITY 섹션만 따로 있을 수도 있음
      // BLOCK 섹션 안에 들어있는 ENTITY는 ENDBLK으로 끝남
      if (curr.value === "ENDBLK" || curr.value === "ENDSEC") {
        scanner.rewind();
        break;
      }

      const handler = Parsers[curr.value];
      if (handler) {
        const entityType = curr.value;
        curr = scanner.next();

        const entity = handler.parseEntity(scanner, curr) as any;
        entity.type = entityType;
        ensureHandle(entity);
        entities.push(entity);
      } else if (scanner.debug) {
        console.warn(`Unsupported ENTITY type: ${curr.value}`);
      }
    }

    curr = scanner.next();
  }
  return entities;
}
