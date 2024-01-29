import DxfArrayScanner, { ScannerGroup } from '../../DxfArrayScanner';
export declare class PointEntityParser {
    static ForEntityName: string;
    private parser;
    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): any;
}
