"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEntities = void 0;
const shared_1 = require("../shared");
const arc_1 = require("./arc");
const attdef_1 = require("./attdef");
const attribute_1 = require("./attribute");
const circle_1 = require("./circle");
const dimension_1 = __importDefault(require("./dimension"));
const ellipse_1 = require("./ellipse");
const insert_1 = require("./insert");
const leader_1 = require("./leader");
const parser_1 = require("./line/parser");
const lwpolyline_1 = require("./lwpolyline");
const parser_2 = require("./mtext/parser");
const point_1 = require("./point");
const polyline_1 = require("./polyline");
const section_1 = require("./section");
const solid_1 = require("./solid");
const spline_1 = require("./spline");
const text_1 = require("./text");
const hatch_1 = require("./hatch");
const viewport_1 = __importDefault(require("./viewport"));
const Parsers = Object.fromEntries([
    arc_1.ArcEntityParser,
    attdef_1.AttDefEntityParser,
    attribute_1.AttributeEntityParser,
    circle_1.CircleEntityParser,
    dimension_1.default,
    ellipse_1.EllipseEntityParser,
    insert_1.InsertEntityParser,
    leader_1.LeaderEntityParser,
    parser_1.LineEntityParser,
    lwpolyline_1.LWPolylineParser,
    parser_2.MTextEntityParser,
    point_1.PointEntityParser,
    polyline_1.PolylineParser,
    section_1.SectionEntityParser,
    solid_1.SolidEntityParser,
    spline_1.SplineEntityParser,
    text_1.TextEntityParser,
    hatch_1.HatchEntityParser,
    viewport_1.default,
].map((parser) => [parser.ForEntityName, new parser()]));
/**
 * Is called after the parser first reads the 0:ENTITIES group. The scanner
 * should be on the start of the first entity already.
 */
function parseEntities(curr, scanner) {
    let entities = [];
    while (!(0, shared_1.isMatched)(curr, 0, 'EOF')) {
        if (curr.code === 0) {
            // BLOCK 섹션 안에 ENTITY 섹션이 있을 수도 있고
            // ENTITY 섹션만 따로 있을 수도 있음
            // BLOCK 섹션 안에 들어있는 ENTITY는 ENDBLK으로 끝남
            if (curr.value === 'ENDBLK' || curr.value === 'ENDSEC') {
                scanner.rewind();
                break;
            }
            const handler = Parsers[curr.value];
            if (handler) {
                const entityType = curr.value;
                curr = scanner.next();
                const entity = handler.parseEntity(scanner, curr);
                entity.type = entityType;
                (0, shared_1.ensureHandle)(entity);
                entities.push(entity);
            }
            else {
                console.warn(`Unsupported ENTITY type: ${curr.value}`);
            }
        }
        curr = scanner.next();
    }
    return entities;
}
exports.parseEntities = parseEntities;
//# sourceMappingURL=index.js.map