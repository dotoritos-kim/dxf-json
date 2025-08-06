import type { DxfArrayScanner, ScannerGroup } from "../../DxfArrayScanner";
import {
	createParser,
	DXFParserSnippet,
	Identity,
	PointParser,
	ToBoolean,
} from "../../shared/parserGenerator";
import { CommonEntitySnippets } from "../shared";
import type { MultiLeaderEntity } from "./types";

const DefaultMultiLeaderEntity = {};

// MULTILEADER 엔티티에 해당하는 그룹 코드와 파서를 정의합니다.
const MultiLeaderEntityParserSnippets: DXFParserSnippet[] = [
	{
		code: 170,
		name: "multileaderType", // 0: none, 1: straight, 2: spline
		parser: Identity,
	},
	{
		code: 291,
		name: "doglegEnabled",
		parser: ToBoolean,
	},
	{
		code: 40,
		name: "doglegLength",
		parser: Identity,
	},
	{
		code: 172,
		name: "contentType", // 0: 없음, 1: 블록, 2: 텍스트
		parser: Identity,
	},
	{
		code: 3,
		name: "textContent",
		parser: Identity,
	},
	{
		code: 12,
		name: "textAnchor",
		parser: PointParser,
	},
	// 블록 콘텐츠 (contentType === 1)
	{
		code: 344,
		name: "blockHandle",
		parser: Identity,
	},
	{
		code: 15,
		name: "blockPosition",
		parser: PointParser,
	},
	{
		code: 302,
		name: "leaderSections",
		parser: parseLeaderSection,
		isMultiple: true,
	},
	...CommonEntitySnippets,
];

/**
 * MULTILEADER의 리더 섹션 파서를 정의합니다.
 * 리더 섹션은 그룹 코드 302로 시작하여 303에서 종료됩니다.
 */
function parseLeaderSection(
	curr: ScannerGroup,
	scanner: DxfArrayScanner,
	entity?: any
): any {
	const section: any = { leaderLines: [] };
	let group: ScannerGroup;
	while (scanner.hasNext()) {
		group = scanner.next();
		// 그룹 코드 303: 리더 섹션 종료
		if (group.code === 303) break;
		switch (group.code) {
			case 10:
				// 리더 섹션의 랜딩 포인트
				section.landingPoint = PointParser(group.value, scanner);
				break;
			case 11:
				// 리더 섹션의 도글 벡터
				section.doglegVector = PointParser(group.value, scanner);
				break;
			case 40:
				// 리더 섹션의 도글 길이 (옵션)
				section.doglegLength = group.value;
				break;
			case 304:
				// 리더 라인 시작 (리더 섹션 내부의 leader line)
				section.leaderLines.push(parseLeaderLine(group, scanner));
				break;
			default:
				// 필요에 따라 추가 그룹 코드 처리
				break;
		}
	}
	return section;
}

/**
 * 리더 라인 파서.
 * 리더 라인 섹션은 그룹 코드 304로 시작해 305에서 종료됩니다.
 */
function parseLeaderLine(
	curr: ScannerGroup,
	scanner: DxfArrayScanner,
	entity?: any
): any {
	const leaderLine: any = { vertices: [] };
	let group: ScannerGroup;
	while (scanner.hasNext()) {
		group = scanner.next();
		if (group.code === 305) break;
		switch (group.code) {
			case 10:
				leaderLine.vertices.push(PointParser(group.value, scanner));
				break;
			default:
				break;
		}
	}
	return leaderLine;
}

export class MultiLeaderEntityParser {
	static ForEntityName = "MULTILEADER";
	private parser = createParser(
		MultiLeaderEntityParserSnippets,
		DefaultMultiLeaderEntity
	);

	parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
		const entity = {} as any;
		this.parser(curr, scanner, entity);
		return entity as MultiLeaderEntity;
	}
}
