import { DXFParserSnippet, Identity } from '../shared/parserGenerator';
import type { CommonDXFObject } from './common';

export const PlotSettingsSnippets: DXFParserSnippet[] = [
    {
        code: 333,
        name: 'shadePlotId',
        parser: Identity,
    },
    {
        code: 149,
        name: 'imageOriginY',
        parser: Identity,
    },
    {
        code: 148,
        name: 'imageOriginX',
        parser: Identity,
    },
    {
        code: 147,
        name: 'scaleFactor',
        parser: Identity,
    },
    {
        code: 78,
        name: 'shadePlotCustomDPI',
        parser: Identity,
    },
    {
        code: 77,
        name: 'shadePlotResolution',
        parser: Identity,
    },
    {
        code: 76,
        name: 'shadePlotMode',
        parser: Identity,
    },
    {
        code: 75,
        name: 'standardScaleType',
        parser: Identity,
    },
    {
        code: 7,
        name: 'currentStyleSheet',
        parser: Identity,
    },
    {
        code: 74,
        name: 'plotType',
        parser: Identity,
    },
    {
        code: 73,
        name: 'plotRotation',
        parser: Identity,
    },
    {
        code: 72,
        name: 'paperUnit',
        parser: Identity,
    },
    {
        code: 70,
        name: 'layoutFlag',
        parser: Identity,
    },
    {
        code: 143,
        name: 'printScaleDenominator',
        parser: Identity,
    },
    {
        code: 142,
        name: 'printScaleNominator',
        parser: Identity,
    },
    {
        code: 141,
        name: 'windowAreaYMax',
        parser: Identity,
    },
    {
        code: 140,
        name: 'windowAreaYMin',
        parser: Identity,
    },
    {
        code: 49,
        name: 'windowAreaXMax',
        parser: Identity,
    },
    {
        code: 48,
        name: 'windowAreaXMin',
        parser: Identity,
    },
    {
        code: 47,
        name: 'plotOriginY',
        parser: Identity,
    },
    {
        code: 46,
        name: 'plotOriginX',
        parser: Identity,
    },
    {
        code: 45,
        name: 'paperHeight',
        parser: Identity,
    },
    {
        code: 44,
        name: 'paperWidth',
        parser: Identity,
    },
    {
        code: 43,
        name: 'marginTop',
        parser: Identity,
    },
    {
        code: 42,
        name: 'marginRight',
        parser: Identity,
    },
    {
        code: 41,
        name: 'marginBottom',
        parser: Identity,
    },
    {
        code: 40,
        name: 'marginLeft',
        parser: Identity,
    },
    {
        code: 6,
        name: 'plotViewName',
        parser: Identity,
    },
    {
        code: 4,
        name: 'paperSize',
        parser: Identity,
    },
    {
        code: 2,
        name: 'configName',
        parser: Identity,
    },
    {
        code: 1,
        name: 'pageSetupName',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
];

export enum PlotPaperUnit {
    INCHES = 0,
    MILLIMETERS = 1,
    PIXELS = 2,
}

export enum PlotType {
    LAST_SCREEN_DISPLAY = 0,
    DRAWING_EXTENTS = 1,
    DRAWING_LIMITS = 2,
    VIEW_SPECIFIED = 3, // specified in plotViewName
    WINDOW_SPECIFIED = 4, // specified in plotViewName
    LAYOUT_INFORMATION = 5,
}

export enum ShadePlotMode {
    AS_DISPLAYED = 0,
    WIREFRAME = 1,
    HIDDEN = 2,
    RENDERED = 3,
}

export enum ShadePlotResolution {
    DRAFT = 0,
    PREVIEW = 1,
    NORMAL = 2,
    PRESENTATION = 3,
    MAXIMUM = 4,
    CUSTOM = 5,
}

export interface PlotSettingDXFObject extends CommonDXFObject {
    subclassMarker: 'AcDbPlotSettings7';
    pageSetupName: string;
    configName: string;
    paperSize: string;
    plotViewName: string;
    marginLeft: number;
    marginBottom: number;
    marginRight: number;
    marginTop: number;
    paperWidth: number;
    paperHeight: number;
    plotOriginX: number;
    plotOriginY: number;
    windowAreaXMin: number;
    windowAreaYMin: number;
    windowAreaXMax: number;
    windowAreaYMax: number;
    printScaleNominator: number;
    printScaleDenominator: number;
    layoutFlag: number;
    plotPaperUnit: PlotPaperUnit;
    plotRotation: 0 | 1 | 2 | 3;
    plotType: PlotType;
    currentStyleSheet: string;
    standardScaleType: number; // see https://help.autodesk.com/view/OARX/2023/ENU/?guid=GUID-1113675E-AB07-4567-801A-310CDE0D56E9
    shadePlotMode: ShadePlotMode;
    shadePlotResolution: ShadePlotResolution;
    shadePlotCustomDPI?: number; // 100 ~ 32767
    scaleFactor: number;
    imageOriginX: number;
    imageOriginY: number;
    shadePlotId: string;
}
