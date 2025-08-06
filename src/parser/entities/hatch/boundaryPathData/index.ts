import { BoundaryPathTypeFlag } from '../../../../consts';
import type { DxfArrayScanner, ScannerGroup } from '../../../DxfArrayScanner';
import { createParser } from '../../../shared/parserGenerator';
import { EdgeBoundaryPathDataSnippets } from './edge';
import { PolylineSnippets } from './polyline';

export function parseBoundaryPathData(
    curr: ScannerGroup,
    scanner: DxfArrayScanner,
) {
    // assume start with 92
    const boundaryPathData = {
        boundaryPathTypeFlag: curr.value,
    };
    const isPolyline =
        boundaryPathData.boundaryPathTypeFlag & BoundaryPathTypeFlag.Polyline;

    curr = scanner.next();

    if (isPolyline) {
        createParser(PolylineSnippets)(curr, scanner, boundaryPathData);
        return boundaryPathData;
    }
    createParser(EdgeBoundaryPathDataSnippets)(curr, scanner, boundaryPathData);
    return boundaryPathData;
}
