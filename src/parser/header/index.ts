import type { DxfArrayScanner, ScannerGroup } from "../DxfArrayScanner";
import { parsePoint } from "../shared/parsePoint";
import { isMatched } from "../shared";

// scanner 위치는 읽히기 전이어야 함
export function parseHeader(curr: ScannerGroup, scanner: DxfArrayScanner) {
	// interesting variables:
	//  $ACADVER, $VIEWDIR, $VIEWSIZE, $VIEWCTR, $TDCREATE, $TDUPDATE
	// http://www.autodesk.com/techpubs/autocad/acadr14/dxf/header_section_al_u05_c.htm
	// Also see VPORT table entries
	let currVarName: string | null = null;
	const header: any = {};

	const setHeaderValue = (name: string | null, value: any) => {
		if (!name) return;
		// 원본 그대로 보존
		header[name] = value;

		// 선행 $ 전부 제거 및 대문자 정규화
		const canonical = name.replace(/^\$+/, "");
		if (canonical) {
			header[canonical] = value; // 무달러
			header[`$${canonical}`] = value; // 싱글달러

			const upper = canonical.toUpperCase();
			header[upper] = value; // 무달러+대문자
			header[`$${upper}`] = value; // 싱글달러+대문자
		}
	};

	while (!isMatched(curr, 0, "EOF")) {
		if (isMatched(curr, 0, "ENDSEC")) {
			break;
		}

		if (curr.code === 9) {
			currVarName = curr.value;
		} else if (curr.code === 10) {
			setHeaderValue(currVarName, parsePoint(scanner));
		} else {
			setHeaderValue(currVarName, curr.value);
		}
		curr = scanner.next();
	}
	return header;
}
