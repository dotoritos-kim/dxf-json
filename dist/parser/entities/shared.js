"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipApplicationGroups = exports.CommonEntitySnippets = exports.ShadowMode = void 0;
const ParseHelpers_1 = require("../ParseHelpers");
const shared_1 = require("../shared");
const parserGenerator_1 = require("../shared/parserGenerator");
const xdata_1 = require("../shared/xdata");
var ShadowMode;
(function (ShadowMode) {
    ShadowMode[ShadowMode["CAST_AND_RECEIVE"] = 0] = "CAST_AND_RECEIVE";
    ShadowMode[ShadowMode["CAST"] = 1] = "CAST";
    ShadowMode[ShadowMode["RECEIVE"] = 2] = "RECEIVE";
    ShadowMode[ShadowMode["IGNORE"] = 3] = "IGNORE";
})(ShadowMode || (exports.ShadowMode = ShadowMode = {}));
// 이게 top에 와야함. 우선순위가 더 높다.
exports.CommonEntitySnippets = [
    ...xdata_1.XDataParserSnippets,
    {
        code: 284,
        name: 'shadowMode',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 390,
        name: 'plotStyleHardId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 440,
        name: 'transparency',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 430,
        name: 'colorName',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 420,
        name: 'color',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 310,
        name: 'proxyEntity',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 92,
        name: 'proxyByte',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 60,
        name: 'isVisible',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 48,
        name: 'lineTypeScale',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 370,
        name: 'lineweight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 62,
        name: 'colorIndex',
        parser(curr, scanner, entity) {
            const colorIndex = curr.value;
            entity.color = (0, ParseHelpers_1.getAcadColor)(Math.abs(colorIndex));
            return colorIndex;
        },
    },
    {
        code: 347,
        name: 'materialObjectHardId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 6,
        name: 'lineType',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 8,
        name: 'layer',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 410,
        name: 'layoutTabName',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 67,
        name: 'isInPaperSpace',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 100, // AcDbEntity를 소모시키기 위함
    },
    {
        code: 330,
        name: 'ownerBlockRecordSoftId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 102, // {ACAD_XDICTIONARY
        parser: skipApplicationGroups,
    },
    {
        code: 102, // {ACAD_REACTORS
        parser: skipApplicationGroups,
    },
    {
        code: 102, // {application_name
        parser: skipApplicationGroups,
    },
    {
        code: 5,
        name: 'handle',
        parser: parserGenerator_1.Identity,
    },
];
function skipApplicationGroups(curr, scanner) {
    curr = scanner.next();
    while (!(0, shared_1.isMatched)(curr, 102) && !(0, shared_1.isMatched)(curr, 0, 'EOF')) {
        curr = scanner.next();
    }
    // } 까지 소비
}
exports.skipApplicationGroups = skipApplicationGroups;
//# sourceMappingURL=shared.js.map