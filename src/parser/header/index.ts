import type { DxfArrayScanner, ScannerGroup } from "../DxfArrayScanner";
import { parsePoint } from "../shared/parsePoint";
import { isMatched } from "../shared";

// Scanner must be positioned before reading
export function parseHeader(curr: ScannerGroup, scanner: DxfArrayScanner) {
	// interesting variables:
	//  $ACADVER, $VIEWDIR, $VIEWSIZE, $VIEWCTR, $TDCREATE, $TDUPDATE
	// http://www.autodesk.com/techpubs/autocad/acadr14/dxf/header_section_al_u05_c.htm
	// Also see VPORT table entries
	let currVarName: string | null = null;
	const header: any = {};

	const setHeaderValue = (name: string | null, value: any) => {
		if (!name) return;
		// Preserve original key
		header[name] = value;

		// Strip leading '$' and add normalized uppercase variants
		const canonical = name.replace(/^\$+/, "");
		if (canonical) {
			header[canonical] = value; // no-dollar
			header[`$${canonical}`] = value; // single-dollar

			const upper = canonical.toUpperCase();
			header[upper] = value; // no-dollar + uppercase
			header[`$${upper}`] = value; // single-dollar + uppercase
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
