"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBoundaryPathData = void 0;
const consts_1 = require("../../../../consts");
const parserGenerator_1 = require("../../../shared/parserGenerator");
const edge_1 = require("./edge");
const polyline_1 = require("./polyline");
function parseBoundaryPathData(curr, scanner) {
    // assume start with 92
    const boundaryPathData = {
        boundaryPathTypeFlag: curr.value,
    };
    const isPolyline = boundaryPathData.boundaryPathTypeFlag & consts_1.BoundaryPathTypeFlag.Polyline;
    curr = scanner.next();
    if (isPolyline) {
        (0, parserGenerator_1.createParser)(polyline_1.PolylineSnippets)(curr, scanner, boundaryPathData);
        return boundaryPathData;
    }
    (0, parserGenerator_1.createParser)(edge_1.EdgeBoundaryPathDataSnippets)(curr, scanner, boundaryPathData);
    return boundaryPathData;
}
exports.parseBoundaryPathData = parseBoundaryPathData;
//# sourceMappingURL=index.js.map