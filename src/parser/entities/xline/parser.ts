import type { DxfArrayScanner, ScannerGroup } from "../../DxfArrayScanner";
import { CommonEntitySnippets } from "../shared";
import {
	createParser,
	DXFParserSnippet,
	Identity,
	PointParser,
} from "../../shared/parserGenerator";
import type { XLineEntity } from "./types";

const DefaultXLineEntity = {
	firstPoint: { x: 0, y: 0, z: 1 },
	extrusionDirection: { x: 0, y: 0, z: 1 },
};

const XLineEntityParserSnippets: DXFParserSnippet[] = [
	{
		code: 10,
		name: "firstPoint",
		parser: PointParser,
	},
	{
		code: 11,
		name: "unitDirection",
		parser: PointParser,
	},
	{
		code: 100,
		name: "subclassMarker",
		parser: Identity,
	},
	...CommonEntitySnippets,
];

export class XLineEntityParser {
	static ForEntityName = "XLINE";
	private parser = createParser(
		XLineEntityParserSnippets,
		DefaultXLineEntity
	);

	parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
		const entity = {} as any;
		this.parser(curr, scanner, entity);
		return entity as XLineEntity;
	}
}
