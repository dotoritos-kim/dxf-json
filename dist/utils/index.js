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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushIfNotEqual = exports.swap = exports.generateIntegers = exports.getBoundBox = exports.updateBounds = exports.classify = exports.swapVector = exports.pointToVector3 = exports.pointToVector2 = void 0;
__exportStar(require("./binarySearch"), exports);
__exportStar(require("./disjointSet"), exports);
__exportStar(require("./graph"), exports);
__exportStar(require("./functional"), exports);
__exportStar(require("./flooding"), exports);
__exportStar(require("./triangle"), exports);
__exportStar(require("./queue"), exports);
const core_1 = require("@fxts/core");
const three_1 = require("three");
function pointToVector2(point) {
    return new three_1.Vector2(point.x, point.y);
}
exports.pointToVector2 = pointToVector2;
function pointToVector3(point) {
    var _a;
    return new three_1.Vector3(point.x, point.y, (_a = point.z) !== null && _a !== void 0 ? _a : 0);
}
exports.pointToVector3 = pointToVector3;
function swapVector(v1, v2) {
    let temp = v1.x;
    v1.x = v2.x;
    v2.x = temp;
    temp = v1.y;
    v1.y = v2.y;
    v2.y = temp;
}
exports.swapVector = swapVector;
function classify(iterable, keySelector) {
    var _a;
    const result = {};
    for (const value of iterable) {
        const key = keySelector(value);
        if (key != null) {
            (_a = result[key]) !== null && _a !== void 0 ? _a : (result[key] = []);
            result[key].push(value);
        }
    }
    return result;
}
exports.classify = classify;
function updateBounds(v, bounds) {
    bounds !== null && bounds !== void 0 ? bounds : (bounds = { minX: v.x, maxX: v.x, minY: v.y, maxY: v.y });
    bounds.minX = Math.min(bounds.minX, v.x);
    bounds.maxX = Math.max(bounds.maxX, v.x);
    bounds.minY = Math.min(bounds.minY, v.y);
    bounds.maxY = Math.max(bounds.maxY, v.y);
    return bounds;
}
exports.updateBounds = updateBounds;
function getBoundBox(vertices) {
    return (0, core_1.reduce)((bound, v) => updateBounds(v, bound), {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
    }, vertices);
}
exports.getBoundBox = getBoundBox;
/**
 * 정수 생성기
 *
 * @param start Inclusive
 * @param end Exclusive
 * @param increment Default = 1
 */
function* generateIntegers(start, end = Infinity, increment = 1) {
    for (let n = start; n !== end; n += increment) {
        yield n;
    }
}
exports.generateIntegers = generateIntegers;
function swap(list, i1, i2) {
    const temp = list[i1];
    list[i1] = list[i2];
    list[i2] = temp;
}
exports.swap = swap;
function pushIfNotEqual(v, vertices) {
    if (!vertices.length) {
        vertices.push(v);
        return;
    }
    const u = vertices.at(-1);
    if (v.x !== u.x || v.y !== u.y) {
        vertices.push(v);
    }
}
exports.pushIfNotEqual = pushIfNotEqual;
//# sourceMappingURL=index.js.map