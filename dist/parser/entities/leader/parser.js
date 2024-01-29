"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultLeaderEntity = {
    isArrowheadEnabled: true,
};
const LeaderEntityParserSnippets = [
    {
        code: 213,
        name: 'offsetFromAnnotation',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 212,
        name: 'offsetFromBlock',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 211,
        name: 'horizontalDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 210,
        name: 'normal',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 340,
        name: 'associatedAnnotation',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 77,
        name: 'byBlockColor',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'vertices',
        parser: parserGenerator_1.PointParser,
        isMultiple: true,
    },
    {
        code: 76,
        name: 'numberOfVertices',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 41,
        name: 'textWidth',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 40,
        name: 'textHeight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 75,
        name: 'isHooklineExists',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 74,
        name: 'isHooklineSameDirection',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 73,
        name: 'leaderCreationFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 72,
        name: 'isSpline',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 71,
        name: 'isArrowheadEnabled',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 3,
        name: 'styleName',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonEntitySnippets,
];
class LeaderEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(LeaderEntityParserSnippets, DefaultLeaderEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.LeaderEntityParser = LeaderEntityParser;
LeaderEntityParser.ForEntityName = 'LEADER';
//# sourceMappingURL=parser.js.map