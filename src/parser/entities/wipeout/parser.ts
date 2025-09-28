import type { DxfArrayScanner, ScannerGroup } from "../../DxfArrayScanner";
import { ImageEntityParser } from "../image";
import type { WipeoutEntity } from "./types";

export class WipeoutEntityParser extends ImageEntityParser {
	static ForEntityName = "WIPEOUT";

	parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
		const entity = super.parseEntity(scanner, curr);
		return entity as WipeoutEntity;
	}
}
