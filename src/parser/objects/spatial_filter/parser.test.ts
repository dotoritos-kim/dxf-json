import { describe, test, expect } from 'vitest';
import { readFileSync } from "fs";
import { join } from "path";
import { DxfArrayScanner } from "../../DxfArrayScanner";
import { createParser } from "../../shared/parserGenerator";
import { SpatialFilterSnippets } from "./parser";

describe("SPATIAL_FILTER", () => {
  test("tc0", () => {
    const content = readFileSync(join(__dirname, "./tc0.partial_dxf"), "utf-8");
    const scanner = new DxfArrayScanner(content.split("\n"));
    const parser = createParser(SpatialFilterSnippets);
    let curr = scanner.next();
    curr = scanner.next(); // skip 0 code

    const obj = {} as any;

    const isReadOnce = parser(curr, scanner, obj);

    expect(obj).toMatchObject({
      subclassMarker: "AcDbSpatialFilter",
      handle: "handle",
      boundaryCount: 2,
      boundaryVertices: [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ],
      normal: { x: 5, y: 55, z: 555 },
      position: { x: 7, y: 77, z: 777 },
      isClipBoundaryDisplayed: true,
      isFrontClipping: false,
      isBackClipping: false,
      ocsToWCSTransform: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
      ],
      wcsToOCSTransform: [
        [12, 13, 14, 15],
        [16, 17, 18, 19],
        [20, 21, 22, 23],
      ],
      extensions: {
        ACAD_REACTORS: [
          { code: 330, value: "9827" }
        ]
      }
    });
    expect(isReadOnce).toBe(true);
  });

  test("tc1", () => {
    const content = readFileSync(join(__dirname, "./tc1.partial_dxf"), "utf-8");
    const scanner = new DxfArrayScanner(content.split("\n"));
    const parser = createParser(SpatialFilterSnippets);
    let curr = scanner.next();
    curr = scanner.next(); // skip 0 code

    const obj = {} as any;

    const isReadOnce = parser(curr, scanner, obj);

    expect(obj).toMatchObject({
      subclassMarker: "AcDbSpatialFilter",
      handle: "handle",
      boundaryCount: 2,
      boundaryVertices: [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ],
      normal: { x: 5, y: 55, z: 555 },
      position: { x: 7, y: 77, z: 777 },
      isClipBoundaryDisplayed: true,
      isFrontClipping: true,
      frontClippingDistance: 9999,
      isBackClipping: true,
      backClippingDistance: 8888,
      ocsToWCSTransform: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
      ],
      wcsToOCSTransform: [
        [12, 13, 14, 15],
        [16, 17, 18, 19],
        [20, 21, 22, 23],
      ],
      extensions: {
        ACAD_REACTORS: [
          { code: 330, value: "9827" }
        ],
        ACAD_XDICTIONARY: [
          { code: 360, value: "8738" }
        ]
      }
    });
    expect(isReadOnce).toBe(true);
  });
});
