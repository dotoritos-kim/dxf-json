"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCommonEntityProperties = exports.skipEmbeddedObject = exports.getAcadColor = void 0;
const AutoCadColorIndex_1 = __importDefault(require("./AutoCadColorIndex"));
const shared_1 = require("./entities/shared");
const shared_2 = require("./shared");
const xdata_1 = require("./shared/xdata");
/**
 * Returns the truecolor value of the given AutoCad color index value
 * @param {import('../types').ColorIndex} index
 * @return {import('../types').ColorInstance} truecolor value as a number
 */
function getAcadColor(index) {
    return AutoCadColorIndex_1.default[index];
}
exports.getAcadColor = getAcadColor;
/** Some entities may contain embedded object which is started by group 101. All the rest data until
 * end of entity should not be interpreted as entity attributes. There is no documentation for this
 * feature.
 * @param scanner
 */
function skipEmbeddedObject(scanner) {
    /* Ensure proper start group. */
    scanner.rewind();
    let curr = scanner.next();
    if (curr.code !== 101) {
        throw new Error('Bad call for skipEmbeddedObject()');
    }
    do {
        curr = scanner.next();
    } while (curr.code !== 0);
    scanner.rewind();
}
exports.skipEmbeddedObject = skipEmbeddedObject;
/**
 * Attempts to parse codes common to all entities. Returns true if the group
 * was handled by this function.
 * @param {*} entity - the entity currently being parsed
 * @param {*} curr - the current group being parsed
 */
function checkCommonEntityProperties(entity, curr, scanner) {
    if ((0, shared_2.isMatched)(curr, 102)) {
        (0, shared_1.skipApplicationGroups)(curr, scanner);
        return true;
    }
    switch (curr.code) {
        case 0:
            entity.type = curr.value;
            break;
        case 5:
            entity.handle = curr.value;
            break;
        case 330:
            if (!entity.ownerDictionarySoftId) {
                entity.ownerDictionarySoftId = curr.value;
            }
            else {
                entity.ownerBlockRecordSoftId = curr.value;
            }
            break;
        case 360:
            entity.ownerdictionaryHardId = curr.value;
            break;
        case 67:
            entity.isInPaperSpace = !!curr.value;
            break;
        case 8:
            entity.layer = curr.value;
            break;
        // Code 6 of an entity indicates inheritance of properties (eg. color).
        //   BYBLOCK means inherits from block
        //   BYLAYER (default) mean inherits from layer
        case 6:
            entity.lineType = curr.value;
            break;
        case 347:
            entity.materialObjectHardId = curr.value;
            break;
        case 62: // Acad Index Color. 0 inherits ByBlock. 256 inherits ByLayer. Default is bylayer
            entity.colorIndex = curr.value;
            entity.color = getAcadColor(Math.abs(curr.value));
            break;
        case 370:
            //From https://www.woutware.com/Forum/Topic/955/lineweight?returnUrl=%2FForum%2FUserPosts%3FuserId%3D478262319
            // An integer representing 100th of mm, must be one of the following values:
            // 0, 5, 9, 13, 15, 18, 20, 25, 30, 35, 40, 50, 53, 60, 70, 80, 90, 100, 106, 120, 140, 158, 200, 211.
            // -3 = STANDARD, -2 = BYLAYER, -1 = BYBLOCK
            entity.lineweight = curr.value;
            break;
        case 48:
            entity.lineTypeScale = curr.value;
            break;
        case 60:
            entity.isVisible = !!curr.value;
            break;
        case 92:
            entity.proxyByte = curr.value;
            break;
        case 310:
            entity.proxyEntity = curr.value;
            break;
        case 100:
            // general한 목적으로는 현 구조로 여기서 처리 불가
            break;
        case 420:
            entity.color = curr.value;
            break;
        case 430:
            entity.transparency = curr.value;
            break;
        case 390:
            entity.plotStyleHardId = curr.value;
            break;
        case 284:
            entity.shadowMode = curr.value;
            break;
        case 1001:
            entity.xdata = (0, xdata_1.parseXData)(curr, scanner);
            break;
        default:
            return false;
    }
    return true;
}
exports.checkCommonEntityProperties = checkCommonEntityProperties;
//# sourceMappingURL=ParseHelpers.js.map