import DxfArrayScanner, { ScannerGroup } from 'parser/DxfArrayScanner';
import { DimensionEntity } from './types';
/**
 * @returns Return `false` if curr is not related to common dimension group
 */
export declare function parseDimension(entity: DimensionEntity, curr: ScannerGroup, scanner: DxfArrayScanner): void;
