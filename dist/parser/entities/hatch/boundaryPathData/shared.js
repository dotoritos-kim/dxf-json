"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonBoundaryPathDataSnippets = void 0;
const parserGenerator_1 = require("../../../shared/parserGenerator");
exports.CommonBoundaryPathDataSnippets = [
    {
        code: 330,
        name: 'sourceBoundaryObjects',
        parser: parserGenerator_1.Identity,
        isMultiple: true,
    },
    {
        code: 97,
        name: 'numberOfSourceBoundaryObjects',
        parser: parserGenerator_1.Identity,
    },
    // 92는 분기에 써야해서 외부에서 주입함
];
//# sourceMappingURL=shared.js.map