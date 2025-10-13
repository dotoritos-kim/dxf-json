import type {
    DimensionTextHorizontal,
    DimensionTextVertical,
    DimensionZeroSuppression,
    DimensionZeroSuppressionAngular,
} from '../../../consts';
import type { CommonDxfTableEntry } from '../types';

/**
 * Union of all possible dimension style variable names.
 * 
 * @see DimStyleVariables
 * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=GUID-F2FAD36F-0CE3-4943-9DAD-A9BCD2AE81DA
 */
export type DimStyleVariable =
    | 'DIMPOST'
    | 'DIMAPOST'
    | 'DIMBLK_OBSOLETE'
    | 'DIMBLK1_OBSOLETE'
    | 'DIMBLK2_OBSOLETE'
    | 'DIMSCALE'
    | 'DIMASZ'
    | 'DIMEXO'
    | 'DIMDLI'
    | 'DIMEXE'
    | 'DIMRND'
    | 'DIMDLE'
    | 'DIMTP'
    | 'DIMTM'
    | 'DIMTXT'
    | 'DIMCEN'
    | 'DIMTSZ'
    | 'DIMALTF'
    | 'DIMLFAC'
    | 'DIMLTEX1'
    | 'DIMLTEX2'
    | 'DIMTVP'
    | 'DIMTFAC'
    | 'DIMGAP'
    | 'DIMALTRND'
    | 'DIMTOL'
    | 'DIMLIM'
    | 'DIMTIH'
    | 'DIMTOH'
    | 'DIMSE1'
    | 'DIMSE2'
    | 'DIMTAD'
    | 'DIMZIN'
    | 'DIMAZIN'
    | 'DIMALT'
    | 'DIMALTD'
    | 'DIMTOFL'
    | 'DIMSAH'
    | 'DIMTIX'
    | 'DIMSOXD'
    | 'DIMCLRD'
    | 'DIMCLRE'
    | 'DIMCLRT'
    | 'DIMADEC'
    | 'DIMUNIT'
    | 'DIMDEC'
    | 'DIMTDEC'
    | 'DIMALTU'
    | 'DIMALTTD'
    | 'DIMAUNIT'
    | 'DIMFRAC'
    | 'DIMFXL'
    | 'DIMFXLON'
    | 'DIMLUNIT'
    | 'DIMDSEP'
    | 'DIMTMOVE'
    | 'DIMJUST'
    | 'DIMSD1'
    | 'DIMSD2'
    | 'DIMTOLJ'
    | 'DIMTZIN'
    | 'DIMALTZ'
    | 'DIMALTTZ'
    | 'DIMFIT'
    | 'DIMUPT'
    | 'DIMATFIT'
    | 'DIMTXSTY'
    | 'DIMLDRBLK'
    | 'DIMBLK'
    | 'DIMBLK1'
    | 'DIMBLK2'
    | 'DIMLWD'
    | 'DIMLWE';

export interface DimStyleVariableSchema {
    name: string;
    code: number;
    defaultValue?: string | number;
    defaultValueImperial?: string | number;
}

/**
 * Key-value pairs of dimension style variables. Useful when combined with `DimStyleVariable`.
 * 
 * @see DimStyleVariable
 */
export type DimStyleVariables = {
    DIMPOST?: string;
    DIMAPOST?: string;
    DIMBLK_OBSOLETE?: string;
    DIMBLK1_OBSOLETE?: string;
    DIMBLK2_OBSOLETE?: string;
    DIMSCALE: number;
    DIMASZ: number;
    DIMEXO: number;
    DIMDLI: number;
    DIMEXE: number;
    DIMRND: number;
    DIMDLE: number;
    DIMTP: number;
    DIMTM: number;
    DIMTXT: number;
    DIMCEN: number;
    DIMTSZ: number;
    DIMALTF: number;
    DIMLFAC: number;
    /** 
     * Sets the linetype of the first extension line. The value is `BYLAYER`, `BYBLOCK`, or the name of a linetype.
     * 
     * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-535BAECA-312A-4841-A064-4FDB3469AAD0
     */
    DIMLTEX1: string;
    /**
     * Sets the linetype of the second extension line. The value is `BYLAYER`, `BYBLOCK`, or the name of a linetype.
     * 
     * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-E2101E66-6741-40BF-B62D-E8201F51BA7F
     */
    DIMLTEX2: string;
    DIMTVP: number;
    DIMTFAC: number;
    DIMGAP: number;
    DIMALTRND: number;
    DIMTOL: number;
    DIMLIM: number;
    DIMTIH: number;
    DIMTOH: number;
    DIMSE1: 0 | 1;
    DIMSE2: 0 | 1;
    DIMTAD: DimensionTextVertical;
    DIMZIN: DimensionZeroSuppression;
    DIMAZIN: DimensionZeroSuppressionAngular;
    DIMALT: 0 | 1;
    DIMALTD: number;
    DIMTOFL: 0 | 1;
    DIMSAH: 0 | 1;
    DIMTIX: 0 | 1;
    DIMSOXD: 0 | 1;
    DIMCLRD: number;
    DIMCLRE: number;
    DIMCLRT: number;
    DIMADEC: number;
    DIMUNIT?: number;
    DIMDEC: number;
    DIMTDEC: number;
    DIMALTU: number;
    DIMALTTD: number;
    DIMAUNIT: number;
    DIMFRAC: number;
    /**
     * Sets the total length of the extension lines starting from the dimension line toward the dimension origin.
     * 
     * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-CC0F54D4-688B-4A14-9926-9840BCB30FCA
     */
    DIMFXL: number;
    /**
     * Controls whether extension lines are set to a fixed length.
     * 
     * When DIMFXLON is on (`1`), extension lines are set to the length specified by `DIMFXL`.
     * 
     * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-D0E2EA4A-4CA2-4286-9439-55A19726C166
     */
    DIMFXLON: 0 | 1;
    DIMLUNIT: number;
    DIMDSEP: string;
    DIMTMOVE: number;
    DIMJUST: DimensionTextHorizontal;
    DIMSD1: 0 | 1;
    DIMSD2: 0 | 1;
    DIMTOLJ: DimensionTextVertical;
    DIMTZIN: DimensionZeroSuppression;
    DIMALTZ: DimensionZeroSuppression;
    DIMALTTZ: DimensionZeroSuppression;
    DIMFIT?: number;
    DIMUPT: number;
    DIMATFIT: number;
    DIMTXSTY?: string;
    DIMLDRBLK?: string;
    DIMBLK?: string;
    DIMBLK1?: string;
    DIMBLK2?: string;
    DIMLWD: number;
    DIMLWE: number;
}

export type DimStylesTableEntry = DimStyleVariables & CommonDxfTableEntry & {
    styleName: string;
    subclassMarker: 'AcDbDimStyleTableRecord';
};

