"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VertexFlag = void 0;
var VertexFlag;
(function (VertexFlag) {
    VertexFlag[VertexFlag["CREATED_BY_CURVE_FIT"] = 1] = "CREATED_BY_CURVE_FIT";
    VertexFlag[VertexFlag["TANGENT_DEFINED"] = 2] = "TANGENT_DEFINED";
    VertexFlag[VertexFlag["NOT_USED"] = 4] = "NOT_USED";
    VertexFlag[VertexFlag["CREATED_BY_SPLINE_FIT"] = 8] = "CREATED_BY_SPLINE_FIT";
    VertexFlag[VertexFlag["SPLINE_CONTROL_POINT"] = 16] = "SPLINE_CONTROL_POINT";
    VertexFlag[VertexFlag["FOR_POLYLINE"] = 32] = "FOR_POLYLINE";
    VertexFlag[VertexFlag["FOR_POLYGON"] = 64] = "FOR_POLYGON";
    VertexFlag[VertexFlag["POLYFACE"] = 128] = "POLYFACE";
})(VertexFlag || (exports.VertexFlag = VertexFlag = {}));
//# sourceMappingURL=consts.js.map