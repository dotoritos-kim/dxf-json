import type DxfArrayScanner from "@src/parser/DxfArrayScanner";
import type { ScannerGroup } from "@src/parser/DxfArrayScanner";
import { isMatched } from "@src/parser/shared";
import {
  DXFParserSnippet,
  Identity,
  ToBoolean,
  PointParser,
} from "@src/parser/shared/parserGenerator";

export const SpatialFilterSnippets: DXFParserSnippet[] = [
  {
    code: 40,
    name: "wcsToOCSTransform",
    parser: matrixParser,
  },
  {
    code: 40,
    name: "ocsToWCSTransform",
    parser: matrixParser,
  },
  {
    code: 41,
    name: "backClippingDistance",
    parser: Identity,
  },
  {
    code: 73,
    name: "isBackClipping",
    parser: ToBoolean,
    pushContext: true,
  },
  {
    code: 40,
    name: "frontClippingDistance",
    parser: Identity,
  },
  {
    code: 72,
    name: "isFrontClipping",
    parser: ToBoolean,
    pushContext: true,
  },
  {
    code: 71,
    name: "isClipBoundaryDisplayed",
    parser: ToBoolean,
  },
  {
    code: 11,
    name: "position",
    parser: PointParser,
  },
  {
    code: 210,
    name: "normal",
    parser: PointParser,
  },
  {
    code: 10,
    name: "boundaryVertices",
    parser: PointParser,
    isMultiple: true,
  },
  {
    code: 70,
    name: "boundaryCount",
    parser: Identity,
  },
  {
    code: 100,
    name: "subclassMarker",
    parser: Identity,
  },
  {
    code: 100, // skip AcDbFilter
  },
  {
    code: 5,
    name: "handle",
    parser: Identity,
  },
];

function matrixParser(curr: ScannerGroup, scanner: DxfArrayScanner) {
  // 4 row x 3 column in column-major ordering
  const matrix: number[][] = [];
  for (let i = 0; i < 3; ++i) {
    if (!isMatched(curr, 40)) break;

    const row: number[] = [];

    for (let j = 0; j < 4; ++j) {
      if (!isMatched(curr, 40)) break;

      row.push(curr.value);

      curr = scanner.next();
    }
    matrix.push(row);
  }

  // parser should not read next value
  // as it's handled by core engine
  scanner.rewind();
  return matrix;
}
