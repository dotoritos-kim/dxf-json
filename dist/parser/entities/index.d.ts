import type DxfArrayScanner from '../DxfArrayScanner';
import { ScannerGroup } from '../DxfArrayScanner';
import { CommonDxfEntity } from './shared';
/**
 * Is called after the parser first reads the 0:ENTITIES group. The scanner
 * should be on the start of the first entity already.
 */
export declare function parseEntities(curr: ScannerGroup, scanner: DxfArrayScanner): CommonDxfEntity[];
