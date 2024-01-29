"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMatched = exports.ensureHandle = void 0;
let lastHandle = 0;
function ensureHandle(entity) {
    if (!entity) {
        throw new TypeError('entity cannot be undefined or null');
    }
    if (!entity.handle) {
        entity.handle = lastHandle++;
    }
}
exports.ensureHandle = ensureHandle;
/**
 * group이 `code`와 `value`를 갖는지 확인
 * `value`가 `null`이나 `undefined`인 경우 아무거나 다 매칭한다고 가정한다.
 */
function isMatched(group, code, value) {
    return group.code === code && (value == null || group.value === value);
}
exports.isMatched = isMatched;
//# sourceMappingURL=index.js.map