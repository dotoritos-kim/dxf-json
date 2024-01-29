import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import type { LWPolylineEntity } from './types';
export declare class LWPolylineParser {
    static ForEntityName: string;
    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): LWPolylineEntity;
}
