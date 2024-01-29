import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import type { LeaderEntity } from './types';
export declare class LeaderEntityParser {
    static ForEntityName: string;
    private parser;
    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): LeaderEntity;
}
