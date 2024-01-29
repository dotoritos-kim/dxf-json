"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DimensionToleranceTextVertical = exports.DimensionTextHorizontal = exports.DimensionZeroSuppressionAngular = exports.DimensionZeroSuppression = exports.DimensionTextVertical = exports.DimensionTextLineSpacing = exports.AttachmentPoint = exports.DimensionType = void 0;
// https://help.autodesk.com/view/OARX/2023/ENU/?guid=GUID-EDD54EAC-A339-4EBA-AEA6-EC8066505E2B
var DimensionType;
(function (DimensionType) {
    DimensionType[DimensionType["Rotated"] = 0] = "Rotated";
    DimensionType[DimensionType["Aligned"] = 1] = "Aligned";
    DimensionType[DimensionType["Angular"] = 2] = "Angular";
    DimensionType[DimensionType["Diameter"] = 3] = "Diameter";
    DimensionType[DimensionType["Radius"] = 4] = "Radius";
    DimensionType[DimensionType["Angular3Point"] = 5] = "Angular3Point";
    DimensionType[DimensionType["Ordinate"] = 6] = "Ordinate";
    DimensionType[DimensionType["ReferenceIsExclusive"] = 32] = "ReferenceIsExclusive";
    DimensionType[DimensionType["IsOrdinateXTypeFlag"] = 64] = "IsOrdinateXTypeFlag";
    DimensionType[DimensionType["IsCustomTextPositionFlag"] = 128] = "IsCustomTextPositionFlag";
})(DimensionType || (exports.DimensionType = DimensionType = {}));
var AttachmentPoint;
(function (AttachmentPoint) {
    AttachmentPoint[AttachmentPoint["TopLeft"] = 1] = "TopLeft";
    AttachmentPoint[AttachmentPoint["TopCenter"] = 2] = "TopCenter";
    AttachmentPoint[AttachmentPoint["TopRight"] = 3] = "TopRight";
    AttachmentPoint[AttachmentPoint["MiddleLeft"] = 4] = "MiddleLeft";
    AttachmentPoint[AttachmentPoint["MiddleCenter"] = 5] = "MiddleCenter";
    AttachmentPoint[AttachmentPoint["MiddleRight"] = 6] = "MiddleRight";
    AttachmentPoint[AttachmentPoint["BottomLeft"] = 7] = "BottomLeft";
    AttachmentPoint[AttachmentPoint["BottomCenter"] = 8] = "BottomCenter";
    AttachmentPoint[AttachmentPoint["BottomRight"] = 9] = "BottomRight";
})(AttachmentPoint || (exports.AttachmentPoint = AttachmentPoint = {}));
var DimensionTextLineSpacing;
(function (DimensionTextLineSpacing) {
    DimensionTextLineSpacing[DimensionTextLineSpacing["AtLeast"] = 1] = "AtLeast";
    DimensionTextLineSpacing[DimensionTextLineSpacing["Exact"] = 2] = "Exact";
})(DimensionTextLineSpacing || (exports.DimensionTextLineSpacing = DimensionTextLineSpacing = {}));
var DimensionTextVertical;
(function (DimensionTextVertical) {
    DimensionTextVertical[DimensionTextVertical["Center"] = 0] = "Center";
    DimensionTextVertical[DimensionTextVertical["Above"] = 1] = "Above";
    DimensionTextVertical[DimensionTextVertical["Outside"] = 2] = "Outside";
    DimensionTextVertical[DimensionTextVertical["JIS"] = 3] = "JIS";
    DimensionTextVertical[DimensionTextVertical["Below"] = 4] = "Below";
})(DimensionTextVertical || (exports.DimensionTextVertical = DimensionTextVertical = {}));
var DimensionZeroSuppression;
(function (DimensionZeroSuppression) {
    DimensionZeroSuppression[DimensionZeroSuppression["Feet"] = 0] = "Feet";
    DimensionZeroSuppression[DimensionZeroSuppression["None"] = 1] = "None";
    DimensionZeroSuppression[DimensionZeroSuppression["Inch"] = 2] = "Inch";
    DimensionZeroSuppression[DimensionZeroSuppression["FeetAndInch"] = 3] = "FeetAndInch";
    DimensionZeroSuppression[DimensionZeroSuppression["Leading"] = 4] = "Leading";
    DimensionZeroSuppression[DimensionZeroSuppression["Trailing"] = 8] = "Trailing";
    DimensionZeroSuppression[DimensionZeroSuppression["LeadingAndTrailing"] = 12] = "LeadingAndTrailing";
})(DimensionZeroSuppression || (exports.DimensionZeroSuppression = DimensionZeroSuppression = {}));
var DimensionZeroSuppressionAngular;
(function (DimensionZeroSuppressionAngular) {
    DimensionZeroSuppressionAngular[DimensionZeroSuppressionAngular["None"] = 0] = "None";
    DimensionZeroSuppressionAngular[DimensionZeroSuppressionAngular["Leading"] = 1] = "Leading";
    DimensionZeroSuppressionAngular[DimensionZeroSuppressionAngular["Trailing"] = 2] = "Trailing";
    DimensionZeroSuppressionAngular[DimensionZeroSuppressionAngular["LeadingAndTrailing"] = 3] = "LeadingAndTrailing";
})(DimensionZeroSuppressionAngular || (exports.DimensionZeroSuppressionAngular = DimensionZeroSuppressionAngular = {}));
var DimensionTextHorizontal;
(function (DimensionTextHorizontal) {
    DimensionTextHorizontal[DimensionTextHorizontal["Center"] = 0] = "Center";
    DimensionTextHorizontal[DimensionTextHorizontal["Left"] = 1] = "Left";
    DimensionTextHorizontal[DimensionTextHorizontal["Right"] = 2] = "Right";
    DimensionTextHorizontal[DimensionTextHorizontal["OverFirst"] = 3] = "OverFirst";
    DimensionTextHorizontal[DimensionTextHorizontal["OverSecond"] = 4] = "OverSecond";
})(DimensionTextHorizontal || (exports.DimensionTextHorizontal = DimensionTextHorizontal = {}));
var DimensionToleranceTextVertical;
(function (DimensionToleranceTextVertical) {
    DimensionToleranceTextVertical[DimensionToleranceTextVertical["Bottom"] = 0] = "Bottom";
    DimensionToleranceTextVertical[DimensionToleranceTextVertical["Center"] = 1] = "Center";
    DimensionToleranceTextVertical[DimensionToleranceTextVertical["Top"] = 2] = "Top";
})(DimensionToleranceTextVertical || (exports.DimensionToleranceTextVertical = DimensionToleranceTextVertical = {}));
//# sourceMappingURL=dimension.js.map