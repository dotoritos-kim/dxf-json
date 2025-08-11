import { describe, test, expect } from 'vitest';
import { readFileSync } from "fs";
import { join } from "path";
import { DxfArrayScanner } from "../../DxfArrayScanner";
import { createParser } from "../../shared/parserGenerator";
import { PlotSettingsSnippets } from './parser';
import type { PlotSettingDXFObject } from './types';
import { PlotPaperUnit, PlotType, ShadePlotMode, ShadePlotResolution } from '../plotSettings/consts';

describe("PLOTSETTINGS", () => {
  test("tc0", () => {
    const content = readFileSync(join(__dirname, "./tc0.partial_dxf"), "utf-8");
    const scanner = new DxfArrayScanner(content.split("\n"));
    const parser = createParser(PlotSettingsSnippets);
    let curr = scanner.next();
    curr = scanner.next(); // skip 0 code

    const obj = { name: 'PLOTSETTINGS' } as any;

    const isReadOnce = parser(curr, scanner, obj);

    expect(obj).toMatchObject<PlotSettingDXFObject>({
      name: 'PLOTSETTINGS',
      subclassMarker: "AcDbPlotSettings",
      handle: 'D9B071D01A0C0BB2',      
      extensions: {
        ACAD_REACTORS: [{ code: 330, value: "D9B071D01A0ACD32" }],
      },
      ownerObjectId: 'D9B071D01A0ACD32',
      pageSetupName: '(Model) 11x17 Final',
      configName: 'HPCJ 1700 (Final).pc3',
      paperSize: 'Tabloid',
      plotViewName: '',
      marginLeft: 58,
      marginBottom: 134,
      marginRight: 587,
      marginTop: 384,
      paperWidth: 279,
      paperHeight: 431,
      plotOriginX: 9906,
      plotOriginY: 555,
      windowAreaXMin: -514,
      windowAreaYMin: 990,
      windowAreaXMax: 277,
      windowAreaYMax: 313,
      printScaleNumerator: 1,
      printScaleDenominator: 26,
      layoutFlag: 0x6B4,
      plotPaperUnit: PlotPaperUnit.INCHES,
      plotRotation: 3,
      plotType: PlotType.LAST_SCREEN_DISPLAY,
      currentStyleSheet: 'Focus Lines (2002).ctb',
      standardScaleType: 0,
      shadePlotMode: ShadePlotMode.AS_DISPLAYED,
      shadePlotResolution: ShadePlotResolution.NORMAL,
      shadePlotCustomDPI: 300,
      scaleFactor: 379,
      imageOriginX: 305,
      imageOriginY: 189,
    });
    expect(isReadOnce).toBe(true);
  });
});
