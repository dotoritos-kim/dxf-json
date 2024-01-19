import type { DxfHeader } from '../types/dxfHeader';
import type { DxfBlock } from './blocks/types';
import type { CommonDxfEntity } from './entities/shared';
import type { CommonDXFObject } from './objects/common';
import type { DxfObject } from './objects/types';
import { BlockRecordTableEntry } from './tables/blockRecord';
import { DimStylesTableEntry } from './tables/dimStyle';
import { LayerTableEntry } from './tables/layer';
import { LTypeTableEntry } from './tables/ltype';
import { StyleTableEntry } from './tables/style';
import { DxfTable } from './tables/types';
import { VPortTableEntry } from './tables/vport';

export interface ParsedDxf {
    header: DxfHeader;
    blocks: Record<string, DxfBlock>;
    entities: CommonDxfEntity[];
    tables: {
        BLOCK_RECORD?: DxfTable<BlockRecordTableEntry>;
        DIMSTYLE?: DxfTable<DimStylesTableEntry>;
        STYLE?: DxfTable<StyleTableEntry>;
        LAYER?: DxfTable<LayerTableEntry>;
        LTYPE?: DxfTable<LTypeTableEntry>;
        VPORT?: DxfTable<VPortTableEntry>;
    };
    objects: {
        byName: Record<string, CommonDXFObject[]>;
        byTree?: DxfObject;
    };
}
