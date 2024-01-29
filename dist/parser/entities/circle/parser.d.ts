import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import type { CircleEntity } from './types';
export declare class CircleEntityParser {
    static ForEntityName: string;
    private parser;
    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): CircleEntity;
}
