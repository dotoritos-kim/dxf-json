"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDummyBlocks = void 0;
const core_1 = require("@fxts/core");
const utils_1 = require("../utils");
function filterDummyBlocks(dxf) {
    var _a, _b;
    // INSERT/DIMENSION 엔티티가 포함된 블록으로 그래프를 만듦
    const namedBlocks = Object.entries(dxf.blocks);
    const graph = {};
    const insertBlocks = (0, core_1.filter)(([_, block]) => { var _a; return (_a = block.entities) === null || _a === void 0 ? void 0 : _a.some(filterInsertOrDimension); }, namedBlocks);
    for (const [name, block] of insertBlocks) {
        for (const subEntity of (_a = block.entities) !== null && _a !== void 0 ? _a : []) {
            if (!filterInsertOrDimension(subEntity))
                continue;
            (_b = graph[name]) !== null && _b !== void 0 ? _b : (graph[name] = []);
            graph[name].push(subEntity.name);
        }
    }
    // 루트 INSERT/DIMENSION 엔티티에서 접근가능한 모든 블록 이름을 수집
    const insertEntities = (0, core_1.filter)(filterInsertOrDimension, dxf.entities);
    const reachableNames = (0, utils_1.flooding)({
        seeds: [...(0, core_1.map)(({ name }) => name, insertEntities)],
        serializer: (name) => name,
        spanner: (name) => { var _a; return (_a = graph[name]) !== null && _a !== void 0 ? _a : []; },
    }).flat();
    return {
        ...dxf,
        blocks: Object.fromEntries(reachableNames.map((name) => [name, dxf.blocks[name]])),
    };
}
exports.filterDummyBlocks = filterDummyBlocks;
function filterInsertOrDimension(entity) {
    return (entity.type === 'INSERT' ||
        (entity.type === 'DIMENSION' && !!entity.name));
}
//# sourceMappingURL=filterDummyBlocks.js.map