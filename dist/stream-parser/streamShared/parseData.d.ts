import { ScannerGroup } from 'parser/DxfArrayScanner';
import type { Point3D } from '../../types';
export declare class parsePoint {
    point: Point3D;
    startCode: number;
    private code;
    private value;
    x: number | undefined;
    y: number | undefined;
    z: number | undefined;
    constructor();
    parseStart(point: ScannerGroup): void;
    setPoint(point: ScannerGroup): {
        x: number;
        y: number;
        z: number;
    } | undefined;
    reset(): void;
}
