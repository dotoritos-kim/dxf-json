"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHeader = void 0;
const parsePoint_1 = require("../shared/parsePoint");
const shared_1 = require("../shared");
// scanner 위치는 읽히기 전이어야 함
function parseHeader(curr, scanner) {
    // interesting variables:
    //  $ACADVER, $VIEWDIR, $VIEWSIZE, $VIEWCTR, $TDCREATE, $TDUPDATE
    // http://www.autodesk.com/techpubs/autocad/acadr14/dxf/header_section_al_u05_c.htm
    // Also see VPORT table entries
    let currVarName = null;
    const header = {};
    while (!(0, shared_1.isMatched)(curr, 0, 'EOF')) {
        if ((0, shared_1.isMatched)(curr, 0, 'ENDSEC')) {
            break;
        }
        if (curr.code === 9) {
            currVarName = curr.value;
        }
        else if (curr.code === 10) {
            header[currVarName] = (0, parsePoint_1.parsePoint)(scanner);
        }
        else {
            header[currVarName] = curr.value;
        }
        curr = scanner.next();
    }
    return header;
}
exports.parseHeader = parseHeader;
//# sourceMappingURL=index.js.map