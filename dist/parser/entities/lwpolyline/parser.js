"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LWPolylineParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../shared");
const DefaultLWPolylineEntity = {
    flag: 0,
    elevation: 0,
    thickness: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
    vertices: [],
};
const DefaultLWPolylineVertex = {
    bulge: 0,
};
const LWPolylineVertexSnippets = [
    {
        code: 42,
        name: 'bulge',
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
        code: 91,
        name: 'id',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 20,
        name: 'y',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'x',
        parser: parserGenerator_1.Identity,
    },
];
const LWPolylineSnippets = [
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 10,
        name: 'vertices',
        isMultiple: true,
        parser(curr, scanner) {
            const entity = {};
            (0, parserGenerator_1.createParser)(LWPolylineVertexSnippets, DefaultLWPolylineVertex)(curr, scanner, entity);
            return entity;
        },
    },
    {
        code: 39,
        name: 'thickness',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 38,
        name: 'elevation',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 43,
        name: 'constantWidth',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'flag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 90,
        name: 'numberOfVertices',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...shared_1.CommonEntitySnippets,
];
class LWPolylineParser {
    parseEntity(scanner, curr) {
        const entity = {};
        (0, parserGenerator_1.createParser)(LWPolylineSnippets, DefaultLWPolylineEntity)(curr, scanner, entity);
        return entity;
    }
}
exports.LWPolylineParser = LWPolylineParser;
LWPolylineParser.ForEntityName = 'LWPOLYLINE';
//# sourceMappingURL=parser.js.map