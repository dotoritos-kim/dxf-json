"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDimStyle = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const consts_1 = require("./consts");
const shared_1 = require("../shared");
const DimStyleTableParserSnippets = [
    ...consts_1.DimStyleVariablesSchema.map((schema) => ({
        ...schema,
        parser: parserGenerator_1.Identity,
    })),
    {
        code: 70,
        name: 'standardFlag',
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
    {
        code: 105,
        name: 'handle',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonTableEntryParserSnippets.filter((snippet) => snippet.code !== 5),
];
exports.parseDimStyle = (0, parserGenerator_1.createParser)(DimStyleTableParserSnippets);
//# sourceMappingURL=parser.js.map