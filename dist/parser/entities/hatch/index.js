"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HatchEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const boundaryPathData_1 = require("./boundaryPathData");
const patternData_1 = require("./patternData");
const DefaultHathEntity = {
    extrusionDirection: { x: 0, y: 0, z: 1 },
    gradientRotation: 0,
    colorTint: 0,
};
const HatchSnippet = [
    {
        // Unused - String (default = LINEAR)
        code: 470,
    },
    {
        // Unused - Reserved for future use:
        code: 463,
    },
    {
        code: 462,
        name: 'colorTint',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 461,
        name: 'gradientDefinition',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 460,
        name: 'gradientRotation', // radian
        parser: parserGenerator_1.Identity,
    },
    {
        code: 453,
        name: 'numberOfColors',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 452,
        name: 'gradientColorFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        // Unused - Zero is reserved for future use
        code: 451,
    },
    {
        code: 450,
        name: 'gradientFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'seedPoints',
        parser: parserGenerator_1.PointParser,
        isMultiple: true,
    },
    {
        // Unused - Number of degenerate boundary paths
        code: 99,
    },
    {
        code: 11,
        name: 'offsetVector',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 98,
        name: 'numberOfSeedPoints',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 47,
        name: 'pixelSize',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 53,
        name: 'definitionLines',
        parser: patternData_1.parsePatternData,
        isMultiple: true,
    },
    {
        code: 78,
        name: 'numberOfDefinitionLines',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 77,
        name: 'isDouble',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 73,
        name: 'isAnnotated',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 41,
        name: 'patternScale',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 52,
        name: 'patternAngle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 76,
        name: 'patternType',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 75,
        name: 'hatchStyle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 92,
        name: 'boundaryPaths',
        parser: boundaryPathData_1.parseBoundaryPathData,
        isMultiple: true,
    },
    {
        code: 91,
        name: 'numberOfBoundaryPaths',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 71,
        name: 'associativity',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 63,
        name: 'patternFillColor',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'solidFill',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 2,
        name: 'patternName',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 10,
        name: 'elevationPoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
        pushContext: true,
    },
    ...shared_1.CommonEntitySnippets,
];
class HatchEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(HatchSnippet, DefaultHathEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.HatchEntityParser = HatchEntityParser;
HatchEntityParser.ForEntityName = 'HATCH';
//# sourceMappingURL=index.js.map