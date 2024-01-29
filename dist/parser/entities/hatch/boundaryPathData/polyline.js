"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolylineSnippets = void 0;
const parsePoint_1 = require("../../../shared/parsePoint");
const parserGenerator_1 = require("../../../shared/parserGenerator");
const shared_1 = require("./shared");
exports.PolylineSnippets = [
    ...shared_1.CommonBoundaryPathDataSnippets,
    {
        code: 10,
        name: 'vertices',
        parser(curr, scanner) {
            const vertex = { ...(0, parsePoint_1.parsePoint)(scanner), bulge: 0 };
            curr = scanner.next();
            if (curr.code === 42) {
                vertex.bulge = curr.value;
            }
            else {
                scanner.rewind();
            }
            return vertex;
        },
        isMultiple: true,
    },
    {
        code: 93,
        name: 'numberOfVertices',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 73,
        name: 'isClosed',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 72,
        name: 'hasBulge',
        parser: parserGenerator_1.ToBoolean,
    },
];
//# sourceMappingURL=polyline.js.map