import type DxfArrayScanner from '../DxfArrayScanner';
import { ScannerGroup } from '../DxfArrayScanner';
export declare const Abort: unique symbol;
export interface DXFParserSnippet {
    code: number | number[];
    name?: string;
    parser?(curr: ScannerGroup, scanner: DxfArrayScanner, entity: any): any;
    isMultiple?: boolean;
    pushContext?: boolean;
}
export type DXFParser = (curr: ScannerGroup, scanner: DxfArrayScanner, target: any) => boolean;
export declare function createParser(snippets: DXFParserSnippet[], defaultObject?: any): DXFParser;
export declare function Identity({ value }: ScannerGroup): any;
export declare function PointParser(_: any, scanner: DxfArrayScanner): import("../../types").Point2D | import("../../types").Point3D;
export declare function ToBoolean({ value }: ScannerGroup): boolean;
