import type { CommonDXFObject } from "../types";
import type { PlotPaperUnit, PlotType, ShadePlotMode, ShadePlotResolution } from "./consts";

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
