import type { DxfHeader } from '../types/dxfHeader.ts'
import type { DxfBlock } from './blocks/types.ts'
import type { CommonDxfEntity } from './entities/shared.ts'
import type { CommonDXFObject } from './objects/types.ts'
import type { BlockRecordTableEntry } from './tables/blockRecord/types.ts'
import type { DimStylesTableEntry } from './tables/dimStyle/types.ts'
import type { LayerTableEntry } from './tables/layer/types.ts'
import type { LTypeTableEntry } from './tables/ltype/types.ts'
import type { StyleTableEntry } from './tables/style/types.ts'
import type { VPortTableEntry } from './tables/vport/types.ts'
import type { DxfTable } from './tables/types.ts'

export interface ParsedDxf {
  header: DxfHeader
  blocks: Record<string, DxfBlock>
  entities: CommonDxfEntity[]
  tables: {
    BLOCK_RECORD?: DxfTable<BlockRecordTableEntry>
    DIMSTYLE?: DxfTable<DimStylesTableEntry>
    STYLE?: DxfTable<StyleTableEntry>
    LAYER?: DxfTable<LayerTableEntry>
    LTYPE?: DxfTable<LTypeTableEntry>
    VPORT?: DxfTable<VPortTableEntry>
  }
  objects: {
    byName: Record<string, CommonDXFObject[]>
    byTree?: CommonDXFObject
  }
  thumbnailImage?: string | Buffer
}
