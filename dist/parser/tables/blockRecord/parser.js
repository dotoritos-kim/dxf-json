"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBlockRecordTable = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const BlockRecordTableParserSnippets = [
    {
        code: 310,
        name: 'bmpPreview',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 281,
        name: 'scalability',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 280,
        name: 'explodability',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'insertionUnits',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 340,
        name: 'layoutObjects',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 2,
        name: 'name',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonTableEntryParserSnippets,
];
exports.parseBlockRecordTable = (0, parserGenerator_1.createParser)(BlockRecordTableParserSnippets);
//# sourceMappingURL=parser.js.map