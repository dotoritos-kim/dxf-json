"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePatternData = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const PatternDataSnippets = [
    {
        code: 49,
        name: 'dashLengths',
        parser: parserGenerator_1.Identity,
        isMultiple: true,
    },
    {
        code: 79,
        name: 'numberOfDashLengths',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 45,
        name: 'offset',
        parser: pseudoPointParser,
    },
    {
        code: 43,
        name: 'base',
        parser: pseudoPointParser,
    },
    {
        code: 53,
        name: 'angle',
        parser: parserGenerator_1.Identity,
    },
];
function pseudoPointParser(curr, scanner) {
    const nextCode = curr.code + 1;
    const offset = {
        x: curr.value,
        y: 1,
    };
    curr = scanner.next();
    if (curr.code === nextCode) {
        offset.y = curr.value;
    }
    else {
        scanner.rewind();
    }
    return offset;
}
function parsePatternData(curr, scanner) {
    const patternData = {};
    (0, parserGenerator_1.createParser)(PatternDataSnippets)(curr, scanner, patternData);
    return patternData;
}
exports.parsePatternData = parsePatternData;
//# sourceMappingURL=patternData.js.map