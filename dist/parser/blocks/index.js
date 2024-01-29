"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBlock = exports.parseBlocks = void 0;
const entities_1 = require("../entities");
const parsePoint_1 = require("../shared/parsePoint");
const shared_1 = require("../shared");
function parseBlocks(curr, scanner) {
    let blocks = {};
    while (!(0, shared_1.isMatched)(curr, 0, 'EOF')) {
        if ((0, shared_1.isMatched)(curr, 0, 'ENDSEC')) {
            break;
        }
        if ((0, shared_1.isMatched)(curr, 0, 'BLOCK')) {
            curr = scanner.next();
            const block = parseBlock(curr, scanner);
            (0, shared_1.ensureHandle)(block);
            if (block.name) {
                blocks[block.name] = block;
            }
        }
        curr = scanner.next();
    }
    return blocks;
}
exports.parseBlocks = parseBlocks;
function parseBlock(curr, scanner) {
    let block = {};
    while (!(0, shared_1.isMatched)(curr, 0, 'EOF')) {
        if ((0, shared_1.isMatched)(curr, 0, 'ENDBLK')) {
            // 당장 ENDBLK 파싱이 없어서 임시로 대충 소비함
            // 소비 안하면 ENTITY에 딸려들어가서 문제 생김
            curr = scanner.next();
            while (!(0, shared_1.isMatched)(curr, 0, 'EOF')) {
                if ((0, shared_1.isMatched)(curr, 100, 'AcDbBlockEnd')) {
                    return block;
                }
                curr = scanner.next();
            }
            break;
        }
        switch (curr.code) {
            case 1:
                block.xrefPath = curr.value;
                break;
            case 2:
                block.name = curr.value;
                break;
            case 3:
                block.name2 = curr.value;
                break;
            case 5:
                block.handle = curr.value;
                break;
            case 8:
                block.layer = curr.value;
                break;
            case 10:
                block.position = (0, parsePoint_1.parsePoint)(scanner);
                break;
            case 67:
                block.paperSpace = curr.value && curr.value == 1 ? true : false;
                break;
            case 70:
                if (curr.value !== 0) {
                    block.type = curr.value;
                }
                break;
            case 100:
                // ignore class markers
                break;
            case 330:
                block.ownerHandle = curr.value;
                break;
            case 0:
                block.entities = (0, entities_1.parseEntities)(curr, scanner);
                break;
        }
        curr = scanner.next();
    }
    return block;
}
exports.parseBlock = parseBlock;
//# sourceMappingURL=index.js.map