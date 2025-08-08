import { describe, test, expect } from 'vitest';
import { readFileSync } from "fs";
import { join } from "path";
import { DxfArrayScanner } from "../../DxfArrayScanner";
import { createParser } from "../../shared/parserGenerator";
import { PlotSettingsSnippets } from './parser';
import type { PlotSettingDXFObject } from './types';
import { PlotPaperUnit, PlotType, ShadePlotMode, ShadePlotResolution } from './consts';

describe("PLOTSETTINGS", () => {
  test("tc0", () => {
    const content = readFileSync(join(__dirname, "./tc0.partial_dxf"), "utf-8");
    const scanner = new DxfArrayScanner(content.split("\n"));
    const parser = createParser(PlotSettingsSnippets);
    let curr = scanner.next();
    curr = scanner.next(); // skip 0 code

    const obj = {} as any;

    const isReadOnce = parser(curr, scanner, obj);

    expect(obj).toMatchObject<PlotSettingDXFObject>({
      subclassMarker: "AcDbPlotSettings",
      handle: 'D9B071D01A0ACD3B',
      extensions: {
        ACAD_REACTORS: [{ code: 330, value: "D9B071D01A0ACD33" }],
        ACAD_XDICTIONARY: [{ code: 360, value: "D9B071D01A0C52C8" }],
      },
      ownerObjectId: 'D9B071D01A0ACD33',
      pageSetupName: '',
      configName: 'HPDJ 800.pc3',
      paperSize: 'User1309',
      plotViewName: '',
      marginLeft: 49,
      marginBottom: 16,
      marginRight: 48,
      marginTop: 15,
      paperWidth: 914,
      paperHeight: 609,
      plotOriginX: 132,
      plotOriginY: 97,
      windowAreaXMin: 100000,
      windowAreaYMin: 200000,
      windowAreaXMax: 300000,
      windowAreaYMax: 400000,
      printScaleNumerator: 9999,
      printScaleDenominator: 8888,
      layoutFlag: 0x2EB4,
      plotPaperUnit: PlotPaperUnit.INCHES,
      plotRotation: 2,
      plotType: PlotType.DRAWING_EXTENTS,
      currentStyleSheet: 'Focus Lines (2002).ctb',
      standardScaleType: 6,
      shadePlotMode: ShadePlotMode.AS_DISPLAYED,
      shadePlotResolution: ShadePlotResolution.NORMAL,
      shadePlotCustomDPI: 150,
      scaleFactor: 1477,
      imageOriginX: 48138,
      imageOriginY: 11587,
    });
    expect(isReadOnce).toBe(true);
  });
});
