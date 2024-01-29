"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutControlFlag = exports.LayoutSnippets = void 0;
const parserGenerator_1 = require("../shared/parserGenerator");
const plotSettings_1 = require("./plotSettings");
// Snippet이 code별로 스택에 들어가기 때문에 일부로 역순으로 적음
exports.LayoutSnippets = [
    {
        code: 333,
        name: 'shadePlotId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 346,
        name: 'orthographicUcsId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 345,
        name: 'namedUcsId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 331,
        name: 'viewportId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 330,
        name: 'paperSpaceTableId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 76,
        name: 'orthographicType',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 17,
        name: 'ucsYAxis',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 16,
        name: 'ucsXAxis',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 13,
        name: 'ucsOrigin',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 146,
        name: 'elevation',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 15,
        name: 'maxExtent',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 14,
        name: 'minExtent',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 12,
        name: 'insertionBase',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 11,
        name: 'maxLimit',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 10,
        name: 'minLimit',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 71,
        name: 'tabOrder',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'controlFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 1,
        name: 'layoutName',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...plotSettings_1.PlotSettingsSnippets,
];
var LayoutControlFlag;
(function (LayoutControlFlag) {
    LayoutControlFlag[LayoutControlFlag["PSLTSCALE"] = 1] = "PSLTSCALE";
    LayoutControlFlag[LayoutControlFlag["LIMCHECK"] = 2] = "LIMCHECK";
})(LayoutControlFlag || (exports.LayoutControlFlag = LayoutControlFlag = {}));
//# sourceMappingURL=layout.js.map