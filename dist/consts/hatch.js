"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundaryPathEdgeType = exports.BoundaryPathTypeFlag = exports.HatchGradientColorFlag = exports.HatchGradientFlag = exports.HatchBoundaryAnnotation = exports.HatchPatternType = exports.HatchStyle = exports.HatchAssociativity = exports.HatchSolidFill = void 0;
var HatchSolidFill;
(function (HatchSolidFill) {
    HatchSolidFill[HatchSolidFill["PatternFill"] = 0] = "PatternFill";
    HatchSolidFill[HatchSolidFill["SolidFill"] = 1] = "SolidFill";
})(HatchSolidFill || (exports.HatchSolidFill = HatchSolidFill = {}));
var HatchAssociativity;
(function (HatchAssociativity) {
    HatchAssociativity[HatchAssociativity["NonAssociative"] = 0] = "NonAssociative";
    HatchAssociativity[HatchAssociativity["Associative"] = 1] = "Associative";
})(HatchAssociativity || (exports.HatchAssociativity = HatchAssociativity = {}));
var HatchStyle;
(function (HatchStyle) {
    HatchStyle[HatchStyle["Normal"] = 0] = "Normal";
    HatchStyle[HatchStyle["Outer"] = 1] = "Outer";
    HatchStyle[HatchStyle["Ignore"] = 2] = "Ignore";
})(HatchStyle || (exports.HatchStyle = HatchStyle = {}));
var HatchPatternType;
(function (HatchPatternType) {
    HatchPatternType[HatchPatternType["UserDefined"] = 0] = "UserDefined";
    HatchPatternType[HatchPatternType["Predefined"] = 1] = "Predefined";
    HatchPatternType[HatchPatternType["Custom"] = 2] = "Custom";
})(HatchPatternType || (exports.HatchPatternType = HatchPatternType = {}));
var HatchBoundaryAnnotation;
(function (HatchBoundaryAnnotation) {
    HatchBoundaryAnnotation[HatchBoundaryAnnotation["NotAnnotated"] = 0] = "NotAnnotated";
    HatchBoundaryAnnotation[HatchBoundaryAnnotation["Annotated"] = 1] = "Annotated";
})(HatchBoundaryAnnotation || (exports.HatchBoundaryAnnotation = HatchBoundaryAnnotation = {}));
var HatchGradientFlag;
(function (HatchGradientFlag) {
    HatchGradientFlag[HatchGradientFlag["Solid"] = 0] = "Solid";
    HatchGradientFlag[HatchGradientFlag["Gradient"] = 1] = "Gradient";
})(HatchGradientFlag || (exports.HatchGradientFlag = HatchGradientFlag = {}));
var HatchGradientColorFlag;
(function (HatchGradientColorFlag) {
    HatchGradientColorFlag[HatchGradientColorFlag["TwoColor"] = 0] = "TwoColor";
    HatchGradientColorFlag[HatchGradientColorFlag["OneColor"] = 1] = "OneColor";
})(HatchGradientColorFlag || (exports.HatchGradientColorFlag = HatchGradientColorFlag = {}));
var BoundaryPathTypeFlag;
(function (BoundaryPathTypeFlag) {
    BoundaryPathTypeFlag[BoundaryPathTypeFlag["Default"] = 0] = "Default";
    BoundaryPathTypeFlag[BoundaryPathTypeFlag["External"] = 1] = "External";
    BoundaryPathTypeFlag[BoundaryPathTypeFlag["Polyline"] = 2] = "Polyline";
    BoundaryPathTypeFlag[BoundaryPathTypeFlag["Derived"] = 4] = "Derived";
    BoundaryPathTypeFlag[BoundaryPathTypeFlag["Textbox"] = 8] = "Textbox";
    BoundaryPathTypeFlag[BoundaryPathTypeFlag["Outermost"] = 16] = "Outermost";
})(BoundaryPathTypeFlag || (exports.BoundaryPathTypeFlag = BoundaryPathTypeFlag = {}));
var BoundaryPathEdgeType;
(function (BoundaryPathEdgeType) {
    BoundaryPathEdgeType[BoundaryPathEdgeType["Line"] = 1] = "Line";
    BoundaryPathEdgeType[BoundaryPathEdgeType["Circular"] = 2] = "Circular";
    BoundaryPathEdgeType[BoundaryPathEdgeType["Elliptic"] = 3] = "Elliptic";
    BoundaryPathEdgeType[BoundaryPathEdgeType["Spline"] = 4] = "Spline";
})(BoundaryPathEdgeType || (exports.BoundaryPathEdgeType = BoundaryPathEdgeType = {}));
//# sourceMappingURL=hatch.js.map