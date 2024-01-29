import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import type { AttdefEntity } from './types';
export declare class AttDefEntityParser {
    static ForEntityName: string;
    private parser;
    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): AttdefEntity;
}
