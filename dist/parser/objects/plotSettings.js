"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadePlotResolution = exports.ShadePlotMode = exports.PlotType = exports.PlotPaperUnit = exports.PlotSettingsSnippets = void 0;
const parserGenerator_1 = require("../shared/parserGenerator");
exports.PlotSettingsSnippets = [
    {
        code: 333,
        name: 'shadePlotId',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 149,
        name: 'imageOriginY',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 148,
        name: 'imageOriginX',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 147,
        name: 'scaleFactor',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 78,
        name: 'shadePlotCustomDPI',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 77,
        name: 'shadePlotResolution',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 76,
        name: 'shadePlotMode',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 75,
        name: 'standardScaleType',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 7,
        name: 'currentStyleSheet',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 74,
        name: 'plotType',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 73,
        name: 'plotRotation',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 72,
        name: 'paperUnit',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'layoutFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 143,
        name: 'printScaleDenominator',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 142,
        name: 'printScaleNominator',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 141,
        name: 'windowAreaYMax',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 140,
        name: 'windowAreaYMin',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 49,
        name: 'windowAreaXMax',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 48,
        name: 'windowAreaXMin',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 47,
        name: 'plotOriginY',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 46,
        name: 'plotOriginX',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 45,
        name: 'paperHeight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 44,
        name: 'paperWidth',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 43,
        name: 'marginTop',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 42,
        name: 'marginRight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 41,
        name: 'marginBottom',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 40,
        name: 'marginLeft',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 6,
        name: 'plotViewName',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 4,
        name: 'paperSize',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 2,
        name: 'configName',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 1,
        name: 'pageSetupName',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
];
var PlotPaperUnit;
(function (PlotPaperUnit) {
    PlotPaperUnit[PlotPaperUnit["INCHES"] = 0] = "INCHES";
    PlotPaperUnit[PlotPaperUnit["MILLIMETERS"] = 1] = "MILLIMETERS";
    PlotPaperUnit[PlotPaperUnit["PIXELS"] = 2] = "PIXELS";
})(PlotPaperUnit || (exports.PlotPaperUnit = PlotPaperUnit = {}));
var PlotType;
(function (PlotType) {
    PlotType[PlotType["LAST_SCREEN_DISPLAY"] = 0] = "LAST_SCREEN_DISPLAY";
    PlotType[PlotType["DRAWING_EXTENTS"] = 1] = "DRAWING_EXTENTS";
    PlotType[PlotType["DRAWING_LIMITS"] = 2] = "DRAWING_LIMITS";
    PlotType[PlotType["VIEW_SPECIFIED"] = 3] = "VIEW_SPECIFIED";
    PlotType[PlotType["WINDOW_SPECIFIED"] = 4] = "WINDOW_SPECIFIED";
    PlotType[PlotType["LAYOUT_INFORMATION"] = 5] = "LAYOUT_INFORMATION";
})(PlotType || (exports.PlotType = PlotType = {}));
var ShadePlotMode;
(function (ShadePlotMode) {
    ShadePlotMode[ShadePlotMode["AS_DISPLAYED"] = 0] = "AS_DISPLAYED";
    ShadePlotMode[ShadePlotMode["WIREFRAME"] = 1] = "WIREFRAME";
    ShadePlotMode[ShadePlotMode["HIDDEN"] = 2] = "HIDDEN";
    ShadePlotMode[ShadePlotMode["RENDERED"] = 3] = "RENDERED";
})(ShadePlotMode || (exports.ShadePlotMode = ShadePlotMode = {}));
var ShadePlotResolution;
(function (ShadePlotResolution) {
    ShadePlotResolution[ShadePlotResolution["DRAFT"] = 0] = "DRAFT";
    ShadePlotResolution[ShadePlotResolution["PREVIEW"] = 1] = "PREVIEW";
    ShadePlotResolution[ShadePlotResolution["NORMAL"] = 2] = "NORMAL";
    ShadePlotResolution[ShadePlotResolution["PRESENTATION"] = 3] = "PRESENTATION";
    ShadePlotResolution[ShadePlotResolution["MAXIMUM"] = 4] = "MAXIMUM";
    ShadePlotResolution[ShadePlotResolution["CUSTOM"] = 5] = "CUSTOM";
})(ShadePlotResolution || (exports.ShadePlotResolution = ShadePlotResolution = {}));
//# sourceMappingURL=plotSettings.js.map