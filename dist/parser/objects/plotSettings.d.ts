import { DXFParserSnippet } from '../shared/parserGenerator';
import type { CommonDXFObject } from './common';
export declare const PlotSettingsSnippets: DXFParserSnippet[];
export declare enum PlotPaperUnit {
    INCHES = 0,
    MILLIMETERS = 1,
    PIXELS = 2
}
export declare enum PlotType {
    LAST_SCREEN_DISPLAY = 0,
    DRAWING_EXTENTS = 1,
    DRAWING_LIMITS = 2,
    VIEW_SPECIFIED = 3,// specified in plotViewName
    WINDOW_SPECIFIED = 4,// specified in plotViewName
    LAYOUT_INFORMATION = 5
}
export declare enum ShadePlotMode {
    AS_DISPLAYED = 0,
    WIREFRAME = 1,
    HIDDEN = 2,
    RENDERED = 3
}
export declare enum ShadePlotResolution {
    DRAFT = 0,
    PREVIEW = 1,
    NORMAL = 2,
    PRESENTATION = 3,
    MAXIMUM = 4,
    CUSTOM = 5
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
    standardScaleType: number;
    shadePlotMode: ShadePlotMode;
    shadePlotResolution: ShadePlotResolution;
    shadePlotCustomDPI?: number;
    scaleFactor: number;
    imageOriginX: number;
    imageOriginY: number;
    shadePlotId: string;
}
