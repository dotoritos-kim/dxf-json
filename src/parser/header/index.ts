import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner';
import { parsePoint } from '../shared/parsePoint';
import { isMatched } from '../shared';

// scanner 위치는 읽히기 전이어야 함
export function parseHeader(curr: ScannerGroup, scanner: DxfArrayScanner) {
    // interesting variables:
    //  $ACADVER, $VIEWDIR, $VIEWSIZE, $VIEWCTR, $TDCREATE, $TDUPDATE
    // http://www.autodesk.com/techpubs/autocad/acadr14/dxf/header_section_al_u05_c.htm
    // Also see VPORT table entries
    let currVarName = null;
    const header: any = {};

    while (!isMatched(curr, 0, 'EOF')) {
        if (isMatched(curr, 0, 'ENDSEC')) {
            break;
        }

        if (curr.code === 9) {
            currVarName = curr.value;
        } else if (curr.code === 10) {
            header[currVarName] = parsePoint(scanner);
        } else {
            header[currVarName] = curr.value;
        }
        curr = scanner.next();
    }
    return header;
}