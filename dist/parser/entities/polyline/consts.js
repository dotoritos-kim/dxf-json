"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmoothType = exports.PolylineFlag = void 0;
var PolylineFlag;
(function (PolylineFlag) {
    PolylineFlag[PolylineFlag["CLOSED_POLYLINE"] = 1] = "CLOSED_POLYLINE";
    PolylineFlag[PolylineFlag["CURVE_FIT"] = 2] = "CURVE_FIT";
    PolylineFlag[PolylineFlag["SPLINE_FIT"] = 4] = "SPLINE_FIT";
    PolylineFlag[PolylineFlag["POLYLINE_3D"] = 8] = "POLYLINE_3D";
    PolylineFlag[PolylineFlag["POLYGON_3D"] = 16] = "POLYGON_3D";
    PolylineFlag[PolylineFlag["CLOSED_POLYGON"] = 32] = "CLOSED_POLYGON";
    PolylineFlag[PolylineFlag["POLYFACE"] = 64] = "POLYFACE";
    PolylineFlag[PolylineFlag["CONTINUOUS"] = 128] = "CONTINUOUS";
})(PolylineFlag || (exports.PolylineFlag = PolylineFlag = {}));
var SmoothType;
(function (SmoothType) {
    SmoothType[SmoothType["NONE"] = 0] = "NONE";
    SmoothType[SmoothType["QUADRATIC"] = 5] = "QUADRATIC";
    SmoothType[SmoothType["CUBIC"] = 6] = "CUBIC";
    SmoothType[SmoothType["BEZIER"] = 8] = "BEZIER";
})(SmoothType || (exports.SmoothType = SmoothType = {}));
//# sourceMappingURL=consts.js.map