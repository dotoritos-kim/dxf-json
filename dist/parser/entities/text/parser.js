"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextEntityParser = exports.TextEntityParserSnippets = exports.DefaultTextEntity = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const consts_1 = require("./consts");
exports.DefaultTextEntity = {
    thickness: 0,
    rotation: 0,
    xScale: 1,
    obliqueAngle: 0,
    styleName: 'STANDARD',
    generationFlag: 0,
    halign: consts_1.TextHorizontalAlign.LEFT,
    valign: consts_1.TextVerticalAlign.BASELINE,
    extrusionDirection: { x: 0, y: 0, z: 1 },
};
exports.TextEntityParserSnippets = [
    {
        code: 73,
        name: 'valign',
        parser: parserGenerator_1.Identity,
    },
    {
        // skip for duplicated AcDbText
        code: 100,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 11,
        name: 'endPoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 72,
        name: 'valign',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 72,
        name: 'halign',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 71,
        name: 'generationFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 7,
        name: 'styleName',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 51,
        name: 'obliqueAngle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 41,
        name: 'xScale',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 50,
        name: 'rotation',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 1,
        name: 'text',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 40,
        name: 'textHeight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'startPoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 39,
        name: 'thickness',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonEntitySnippets,
];
class TextEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(exports.TextEntityParserSnippets, exports.DefaultTextEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.TextEntityParser = TextEntityParser;
TextEntityParser.ForEntityName = 'TEXT';
//# sourceMappingURL=parser.js.map