"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObscuredLineTypes = void 0;
/**
 * Specifies the linetype of obscured lines.
 * Obscured linetypes are independent of zoom level,
 * unlike standard object linetypes.
 *
 * Value 0 turns off display of obscured lines and is the default
 * */
var ObscuredLineTypes;
(function (ObscuredLineTypes) {
    ObscuredLineTypes[ObscuredLineTypes["Off"] = 0] = "Off";
    ObscuredLineTypes[ObscuredLineTypes["Solid"] = 1] = "Solid";
    ObscuredLineTypes[ObscuredLineTypes["Dashed"] = 2] = "Dashed";
    ObscuredLineTypes[ObscuredLineTypes["Dotted"] = 3] = "Dotted";
    ObscuredLineTypes[ObscuredLineTypes["ShotDash"] = 4] = "ShotDash";
    ObscuredLineTypes[ObscuredLineTypes["MediumDash"] = 5] = "MediumDash";
    ObscuredLineTypes[ObscuredLineTypes["LongDash"] = 6] = "LongDash";
    ObscuredLineTypes[ObscuredLineTypes["DoubleShortDash"] = 7] = "DoubleShortDash";
    ObscuredLineTypes[ObscuredLineTypes["DoubleMediumDash"] = 8] = "DoubleMediumDash";
    ObscuredLineTypes[ObscuredLineTypes["DoubleLongDash"] = 9] = "DoubleLongDash";
    ObscuredLineTypes[ObscuredLineTypes["DoubleMediumLongDash"] = 10] = "DoubleMediumLongDash";
    ObscuredLineTypes[ObscuredLineTypes["SparseDot"] = 11] = "SparseDot";
})(ObscuredLineTypes || (exports.ObscuredLineTypes = ObscuredLineTypes = {}));
//# sourceMappingURL=obscuredLineTypes.js.map