"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStyleTable = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const StyleTableParserSnippets = [
    {
        code: 1000,
        name: 'extendedFont',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 1001, // ACAD signature, skip
    },
    {
        code: 4,
        name: 'bigFont',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 3,
        name: 'font',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 42,
        name: 'lastHeight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 71,
        name: 'textGenerationFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 50,
        name: 'obliqueAngle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 41,
        name: 'widthFactor',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 40,
        name: 'fixedTextHeight',
        parser: parserGenerator_1.Identity,
    },
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
    ...shared_1.CommonTableEntryParserSnippets,
];
exports.parseStyleTable = (0, parserGenerator_1.createParser)(StyleTableParserSnippets);
//# sourceMappingURL=parser.js.map