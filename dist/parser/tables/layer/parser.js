"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLayerTable = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const LayerTableParserSnippets = [
    {
        code: 347,
        name: 'materialObjectId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 390,
        name: 'plotStyleNameObjectId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 370,
        name: 'lineweight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 290,
        name: 'isPlotting',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 6,
        name: 'lineType',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 62,
        name: 'colorIndex',
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
exports.parseLayerTable = (0, parserGenerator_1.createParser)(LayerTableParserSnippets);
//# sourceMappingURL=parser.js.map