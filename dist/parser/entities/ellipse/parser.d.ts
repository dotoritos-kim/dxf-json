import DxfArrayScanner, { ScannerGroup } from '../../DxfArrayScanner';
import { EllipseEntity } from './types';
export declare class EllipseEntityParser {
    static ForEntityName: string;
    private parser;
    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): EllipseEntity;
}
