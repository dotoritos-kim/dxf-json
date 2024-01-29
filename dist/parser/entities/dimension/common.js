"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDimension = void 0;
const helpers = __importStar(require("../../ParseHelpers"));
const parsePoint_1 = require("../../shared/parsePoint");
/**
 * @returns Return `false` if curr is not related to common dimension group
 */
function parseDimension(entity, curr, scanner) {
    switch (curr.code) {
        case 100:
            entity.subclassMarker = curr.value;
            break;
        case 280:
            entity.version = curr.value;
            break;
        case 2:
            entity.name = curr.value;
            break;
        case 10:
            entity.definitionPoint = (0, parsePoint_1.parsePoint)(scanner);
            break;
        case 11:
            entity.textPoint = (0, parsePoint_1.parsePoint)(scanner);
            break;
        case 12:
            // for aligned
            entity.insertionPoint = (0, parsePoint_1.parsePoint)(scanner);
            break;
        case 13:
            // group 13 and 14 are subclass specific definition point
            // for further information, look dxf dimension specification
            entity.subDefinitionPoint1 = (0, parsePoint_1.parsePoint)(scanner);
            break;
        case 14:
            entity.subDefinitionPoint2 = (0, parsePoint_1.parsePoint)(scanner);
            break;
        case 15:
            // for angular, radial, diameter
            entity.centerPoint = (0, parsePoint_1.parsePoint)(scanner);
            break;
        case 16:
            // for angular
            entity.arcPoint = (0, parsePoint_1.parsePoint)(scanner);
            break;
        case 70:
            entity.dimensionType = curr.value;
            break;
        case 71:
            entity.attachmentPoint = curr.value;
            break;
        case 72:
            entity.textLineSpacingStyle = curr.value;
            break;
        case 40:
            // for radial, diameter
            entity.leaderLength = curr.value;
            break;
        case 41:
            entity.textLineSpacingFactor = curr.value;
            break;
        case 42:
            entity.measurement = curr.value;
            break;
        case 1:
            // if value === null or "<>", measurement should be drawn as text instead
            // if value === "", text is suppressed.
            // otherwise text should be drawn as is.
            entity.text = curr.value;
            break;
        case 50:
            // for aligned
            entity.rotationAngle = curr.value;
            break;
        case 52:
            // for aligned
            entity.obliqueAngle = curr.value;
            break;
        case 53:
            entity.textRotation = curr.value;
            break;
        case 51:
            // This group value is the negative of the angle between the OCS X axis
            // and the UCS X axis. It is always in the XY plane of the OCS
            entity.ocsRotation = curr.value;
            break;
        case 210:
            entity.extrusionDirection = (0, parsePoint_1.parsePoint)(scanner);
            break;
        case 3:
            entity.styleName = curr.value;
            break;
        default:
            helpers.checkCommonEntityProperties(entity, curr, scanner);
            break;
    }
}
exports.parseDimension = parseDimension;
//# sourceMappingURL=common.js.map