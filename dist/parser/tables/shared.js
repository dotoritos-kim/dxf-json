"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonTableEntryParserSnippets = void 0;
const parserGenerator_1 = require("../shared/parserGenerator");
const shared_1 = require("../shared");
exports.CommonTableEntryParserSnippets = [
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 330,
        name: 'ownerObjectId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 102,
        parser(curr, scanner) {
            while (!(0, shared_1.isMatched)(curr, 0, 'EOF') && !(0, shared_1.isMatched)(curr, 102, '}')) {
                curr = scanner.next();
            }
        },
    },
    {
        // DIMSTYLE만 예외적으로 미적용
        code: 5,
        name: 'handle',
        parser: parserGenerator_1.Identity,
    },
];
//# sourceMappingURL=shared.js.map