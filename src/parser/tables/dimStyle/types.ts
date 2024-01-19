import type {
    DimensionTextHorizontal,
    DimensionTextVertical,
    DimensionZeroSuppression,
    DimensionZeroSuppressionAngular,
} from '../../../consts';
import type { CommonDxfTableEntry } from '../types';

// https://help.autodesk.com/view/OARX/2023/ENU/?guid=GUID-F2FAD36F-0CE3-4943-9DAD-A9BCD2AE81DA
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

export type DimStylesTableEntry = {
    subclassMarker: 'AcDbDimStyleTableRecord';
    styleName: string;
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
    DIMADEC?: number;
    DIMUNIT?: number;
    DIMDEC: number;
    DIMTDEC: number;
    DIMALTU: number;
    DIMALTTD: number;
    DIMAUNIT: number;
    DIMFRAC: number;
    DIMLUNIT: number;
    DIMDSEP: string;
    DIMTMOVE: undefined; // 미사용
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
} & CommonDxfTableEntry;

export type StyleResolver = <Name extends DimStyleVariable>(
    variableName: Name,
) => DimStylesTableEntry[Name];
