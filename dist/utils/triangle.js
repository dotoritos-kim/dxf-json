"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTriangle = void 0;
const three_1 = require("three");
const ZeroVector = new three_1.Vector2();
// 끝점을 position을 가리키도록 설정
function createTriangle(position, angle, width, height) {
    return [
        position.clone(),
        position
            .clone()
            .add(new three_1.Vector2(-width, height / 2).rotateAround(ZeroVector, angle)),
        position
            .clone()
            .add(new three_1.Vector2(-width, -height / 2).rotateAround(ZeroVector, angle)),
    ];
}
exports.createTriangle = createTriangle;
//# sourceMappingURL=triangle.js.map