import DxfArrayScanner, { ScannerGroup } from 'parser/DxfArrayScanner';
import { DimensionEntity } from './types';
export default class DimensionParser {
    static ForEntityName: string;
    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): DimensionEntity;
}
