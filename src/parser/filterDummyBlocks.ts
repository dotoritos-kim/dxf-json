import { filter, map } from '@fxts/core';
import type { ParsedDxf } from './types';
import type { CommonDxfEntity } from './entities/shared';
import type { DimensionEntity } from './entities/dimension/types';
import type { InsertEntity } from './entities/insert';
import { flooding } from '../utils';

export function filterDummyBlocks(dxf: ParsedDxf): ParsedDxf {
    // INSERT/DIMENSION 엔티티가 포함된 블록으로 그래프를 만듦
    const namedBlocks = Object.entries(dxf.blocks);
    const graph: Record<string, string[]> = {};
    const insertBlocks = filter(
        ([_, block]) => block.entities?.some(filterInsertOrDimension),
        namedBlocks,
    );

    for (const [name, block] of insertBlocks) {
        for (const subEntity of block.entities ?? []) {
            if (!filterInsertOrDimension(subEntity)) continue;

            graph[name] ??= [];
            graph[name].push(subEntity.name);
        }
    }

    // 루트 INSERT/DIMENSION 엔티티에서 접근가능한 모든 블록 이름을 수집
    const insertEntities = filter(filterInsertOrDimension, dxf.entities);
    const reachableNames = flooding<string>({
        seeds: [...map(({ name }) => name, insertEntities)],
        serializer: (name) => name,
        spanner: (name) => graph[name] ?? [],
    }).flat();

    return {
        ...dxf,
        blocks: Object.fromEntries(
            reachableNames.map((name) => [name, dxf.blocks[name]]),
        ),
    };
}

function filterInsertOrDimension(
    entity: CommonDxfEntity,
): entity is InsertEntity | DimensionEntity {
    return (
        entity.type === 'INSERT' ||
        (entity.type === 'DIMENSION' && !!(entity as DimensionEntity).name)
    );
}
