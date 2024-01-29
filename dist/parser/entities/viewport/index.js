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
const helpers = __importStar(require("../../ParseHelpers"));
const parsePoint_1 = require("../../shared/parsePoint");
const utils_1 = require("../../../utils");
class ViewportParser {
    parseEntity(scanner, curr) {
        const entity = {};
        while (curr !== 'EOF') {
            if (curr.code === 0) {
                scanner.rewind();
                return entity;
            }
            if (!parseViewport(entity, scanner, curr)) {
                helpers.checkCommonEntityProperties(entity, curr, scanner);
            }
            curr = scanner.next();
        }
        return entity;
    }
}
ViewportParser.ForEntityName = 'VIEWPORT';
exports.default = ViewportParser;
function parseViewport(entity, scanner, curr) {
    var _a;
    if (curr === 'EOF')
        return false;
    switch (curr.code) {
        case 0:
            return false;
        case 100:
            entity.subclassMarker = curr.value;
            break;
        case 10:
            entity.viewportCenter = (0, utils_1.pointToVector3)((0, parsePoint_1.parsePoint)(scanner));
            break;
        case 40:
            entity.width = curr.value;
            break;
        case 41:
            entity.height = curr.value;
            break;
        case 68:
            entity.status = curr.value;
            break;
        case 69:
            entity.viewportId = curr.value;
            break;
        case 12:
            entity.displayCenter = (0, utils_1.pointToVector2)((0, parsePoint_1.parsePoint)(scanner));
            break;
        case 13:
            entity.snapBase = (0, utils_1.pointToVector2)((0, parsePoint_1.parsePoint)(scanner));
            break;
        case 14:
            entity.snapSpacing = (0, utils_1.pointToVector2)((0, parsePoint_1.parsePoint)(scanner));
            break;
        case 15:
            entity.gridSpacing = (0, utils_1.pointToVector2)((0, parsePoint_1.parsePoint)(scanner));
            break;
        case 16:
            entity.viewDirection = (0, utils_1.pointToVector3)((0, parsePoint_1.parsePoint)(scanner));
            break;
        case 17:
            entity.targetPoint = (0, utils_1.pointToVector3)((0, parsePoint_1.parsePoint)(scanner));
            break;
        case 42:
            entity.perspectiveLensLength = curr.value;
            break;
        case 43:
            entity.frontClipZ = curr.value;
            break;
        case 44:
            entity.backClipZ = curr.value;
            break;
        case 45:
            entity.viewHeight = curr.value;
            break;
        case 50:
            entity.snapAngle = curr.value;
            break;
        case 51:
            entity.viewTwistAngle = curr.value;
            break;
        case 72:
            entity.circleZoomPercent = curr.value;
            break;
        case 331:
            (_a = entity.frozenLayerIds) !== null && _a !== void 0 ? _a : (entity.frozenLayerIds = []);
            entity.frozenLayerIds.push(curr.value);
            break;
        case 90:
            entity.statusBitFlags = curr.value;
            break;
        case 340:
            entity.clippingBoundaryId = curr.value;
            break;
        case 1:
            entity.sheetName = curr.value;
            break;
        case 281:
            entity.renderMode = curr.value;
            break;
        case 71:
            entity.ucsPerViewport = curr.value;
            break;
        case 110:
            entity.ucsOrigin = (0, utils_1.pointToVector3)((0, parsePoint_1.parsePoint)(scanner));
            break;
        case 111:
            entity.ucsXAxis = (0, utils_1.pointToVector3)((0, parsePoint_1.parsePoint)(scanner));
            break;
        case 112:
            entity.ucsYAxis = (0, utils_1.pointToVector3)((0, parsePoint_1.parsePoint)(scanner));
            break;
        case 345:
            entity.ucsId = curr.value;
            break;
        case 346:
            entity.ucsBaseId = curr.value;
            break;
        case 79:
            entity.orthographicType = curr.value;
            break;
        case 146:
            entity.elevation = curr.value;
            break;
        case 170:
            entity.shadePlotMode = curr.value;
            break;
        case 61:
            entity.majorGridFrequency = curr.value;
            break;
        case 332:
            entity.backgroundId = curr.value;
            break;
        case 333:
            entity.shadePlotId = curr.value;
            break;
        case 348:
            entity.visualStyleId = curr.value;
            break;
        case 292:
            entity.isDefaultLighting = !!curr.value;
            break;
        case 282:
            entity.defaultLightingType = curr.value;
            break;
        case 141:
            entity.brightness = curr.value;
            break;
        case 142:
            entity.contrast = curr.value;
            break;
        case 63: // 타입이 조금씩 다름 셋 중 하나로 표현된다는 뜻인듯
        case 421:
        case 431:
            entity.ambientLightColor = curr.value;
            break;
        case 361:
            entity.sunId = curr.value;
            break;
        case 335:
        case 343:
        case 344:
        case 91:
            entity.softPointer = curr.value;
            break;
    }
    return true;
}
//# sourceMappingURL=index.js.map