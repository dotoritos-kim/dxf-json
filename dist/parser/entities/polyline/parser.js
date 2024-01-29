"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolylineParser = void 0;
const shared_1 = require("../../shared");
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_2 = require("../shared");
const vertex_1 = require("../vertex");
const DefaultPolylineEntity = {
    thickness: 0,
    flag: 0,
    startWidth: 0,
    endWidth: 0,
    meshMVertexCount: 0,
    meshNVertexCount: 0,
    surfaceMDensity: 0,
    surfaceNDensity: 0,
    smoothType: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
    vertices: [],
};
const PolylineParserSnippets = [
    {
        code: 0,
        name: 'vertices',
        isMultiple: true,
        parser(curr, scanner) {
            // Polyline 정의부 이후 바로 다음에 이것들이 나옴
            if (!(0, shared_1.isMatched)(curr, 0, 'VERTEX')) {
                return parserGenerator_1.Abort;
            }
            curr = scanner.next();
            return new vertex_1.VertexParser().parseEntity(scanner, curr);
        },
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 75,
        name: 'smoothType',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 74,
        name: 'surfaceNDensity',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 73,
        name: 'surfaceMDensity',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 72,
        name: 'meshNVertexCount',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 71,
        name: 'meshMVertexCount',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 41,
        name: 'endWidth',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 40,
        name: 'startWidth',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'flag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 39,
        name: 'thickness',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 30,
        name: 'elevation',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 20, // dummy point, always 0
    },
    {
        code: 10, // dummy point, always 0
    },
    {
        code: 66, // obsolete, ignore
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_2.CommonEntitySnippets,
];
class PolylineParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(PolylineParserSnippets, DefaultPolylineEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.PolylineParser = PolylineParser;
PolylineParser.ForEntityName = 'POLYLINE';
//# sourceMappingURL=parser.js.map