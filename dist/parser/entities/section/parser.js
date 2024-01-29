"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultSectionEntity = {
    vertices: [],
    backLineVertices: [],
};
const SectionEntityParserSnippets = [
    {
        code: 360,
        name: 'geometrySettingHardId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 12,
        name: 'backLineVertices',
        isMultiple: true,
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 93,
        name: 'numberOfBackLineVertices',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 11,
        name: 'vertices',
        isMultiple: true,
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 92,
        name: 'verticesCount',
        parser: parserGenerator_1.Identity,
    },
    {
        code: [63, 411],
        name: 'indicatorColor',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'indicatorTransparency',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 41,
        name: 'bottomHeight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 40,
        name: 'topHeight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'verticalDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 1,
        name: 'name',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 91,
        name: 'flag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 90,
        name: 'state',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonEntitySnippets,
];
class SectionEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(SectionEntityParserSnippets, DefaultSectionEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.SectionEntityParser = SectionEntityParser;
SectionEntityParser.ForEntityName = 'SECTION';
//# sourceMappingURL=parser.js.map