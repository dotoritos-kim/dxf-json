import type DxfArrayScanner from '../DxfArrayScanner';
import { ScannerGroup } from '../DxfArrayScanner';
export declare function parseObjects(curr: ScannerGroup, scanner: DxfArrayScanner): {
    byName: Record<string, any[]>;
    byTree: import("./types").DxfObject;
};
