
export * from "./types";
export * from "./shared";

import type DxfArrayScanner from "../DxfArrayScanner";
import { ScannerGroup } from "../DxfArrayScanner";
import { ensureHandle, isMatched } from "../shared";


import { ArcEntityParser } from "./arc";
import { AttDefEntityParser } from "./attdef";
import { AttributeEntityParser } from "./attribute";
import { CircleEntityParser } from "./circle";
import Dimension from "./dimension";
import { EllipseEntityParser } from "./ellipse";
import { ImageEntityParser } from "./image";
import { InsertEntityParser } from "./insert";
import { LeaderEntityParser } from "./leader";
import { LineEntityParser } from "./line/parser";
import { LWPolylineParser } from "./lwpolyline";
import { MTextEntityParser } from "./mtext/parser";
import { PointEntityParser } from "./point";
import { PolylineParser } from "./polyline";
import { RayParser } from "./ray";
import { SectionEntityParser } from "./section";
import { SolidEntityParser } from "./solid";
import { SplineEntityParser } from "./spline";
import { TextEntityParser } from "./text";
import { HatchEntityParser } from "./hatch";
import Viewport from "./viewport";
import { CommonDxfEntity } from "./shared";

import { MultiLeaderEntityParser } from "./multileader";

const Parsers = Object.fromEntries(
	[
		ArcEntityParser,
		AttDefEntityParser,
		AttributeEntityParser,
		CircleEntityParser,
		Dimension,
		EllipseEntityParser,
		InsertEntityParser,
		LeaderEntityParser,
		LineEntityParser,
		LWPolylineParser,
		MTextEntityParser,
		MultiLeaderEntityParser,
		PointEntityParser,
		PolylineParser,
		SectionEntityParser,
		SolidEntityParser,
		SplineEntityParser,
		TextEntityParser,
		HatchEntityParser,
		Viewport,
	].map((parser) => [parser.ForEntityName, new parser()])
);

/**
 * Is called after the parser first reads the 0:ENTITIES group. The scanner
 * should be on the start of the first entity already.
 */
export function parseEntities(
  curr: ScannerGroup,
  scanner: DxfArrayScanner
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
      } else {
        console.warn(`Unsupported ENTITY type: ${curr.value}`);
      }
    }

    curr = scanner.next();
  }
  return entities;
}
