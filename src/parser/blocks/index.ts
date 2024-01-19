import type DxfArrayScanner from '../DxfArrayScanner';
import type { ScannerGroup } from '../DxfArrayScanner';
import { parseEntities } from '../entities';
import { parsePoint } from '../shared/parsePoint';
import { ensureHandle, isMatched } from '../shared';

export function parseBlocks(curr: ScannerGroup, scanner: DxfArrayScanner) {
    let blocks: any = {};

    while (!isMatched(curr, 0, 'EOF')) {
        if (isMatched(curr, 0, 'ENDSEC')) {
            break;
        }

        if (isMatched(curr, 0, 'BLOCK')) {
            curr = scanner.next();
            const block = parseBlock(curr, scanner);

            ensureHandle(block);
            if (block.name) {
                blocks[block.name] = block;
            }
        }

        curr = scanner.next();
    }
    return blocks;
}

export function parseBlock(curr: ScannerGroup, scanner: DxfArrayScanner) {
    let block: any = {};

    while (!isMatched(curr, 0, 'EOF')) {
        if (isMatched(curr, 0, 'ENDBLK')) {
            // 당장 ENDBLK 파싱이 없어서 임시로 대충 소비함
            // 소비 안하면 ENTITY에 딸려들어가서 문제 생김
            curr = scanner.next();
            while (!isMatched(curr, 0, 'EOF')) {
                if (isMatched(curr, 100, 'AcDbBlockEnd')) {
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
                block.position = parsePoint(scanner);
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
                block.entities = parseEntities(curr, scanner);
                break;
        }

        curr = scanner.next();
    }
    return block;
}
