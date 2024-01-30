import DxfArrayScanner, { ScannerGroup } from './DxfArrayScanner';
import { CommonDxfEntity } from './entities/shared';
/**
 * Returns the truecolor value of the given AutoCad color index value
 * @param {import('../types').ColorIndex} index
 * @return {import('../types').ColorInstance} truecolor value as a number
 */
export declare function getAcadColor(index: number): number;
/** Some entities may contain embedded object which is started by group 101. All the rest data until
 * end of entity should not be interpreted as entity attributes. There is no documentation for this
 * feature.
 * @param scanner
 */
export declare function skipEmbeddedObject(scanner: DxfArrayScanner): void;
/**
 * Attempts to parse codes common to all entities. Returns true if the group
 * was handled by this function.
 * @param {*} entity - the entity currently being parsed
 * @param {*} curr - the current group being parsed
 */
export declare function checkCommonEntityProperties(entity: CommonDxfEntity, curr: ScannerGroup, scanner: DxfArrayScanner): boolean;
