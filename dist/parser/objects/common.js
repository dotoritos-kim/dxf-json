"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonObjectSnippets = void 0;
const parserGenerator_1 = require("../shared/parserGenerator");
exports.CommonObjectSnippets = [
    {
        code: 330,
        name: 'ownerObjectId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 102,
        // end of ACAD_XDICTIONARY
    },
    {
        code: 360,
        name: 'ownerDictionaryIdHard',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 102,
        // start of ACAD_XDICTIONARY
    },
    {
        code: 102,
        // end of ACAD_REACTOR
    },
    {
        code: 330,
        name: 'ownerDictionaryIdSoft',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 102,
        // start of ACAD_REACTOR
    },
    {
        code: 102,
        // end of application defined
    },
    {
        code: 102,
        // start of application defined
    },
    {
        code: 5,
        name: 'handle',
        parser: parserGenerator_1.Identity,
    },
];
//# sourceMappingURL=common.js.map