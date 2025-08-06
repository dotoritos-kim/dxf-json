import { describe, it, expect } from 'vitest';
import { DxfArrayScanner } from '../DxfArrayScanner';
import { parseBlock, parseBlocks } from '.';
import { isMatched } from '../shared';

const content = ` 0
BLOCK
 2
block-0
 100
AcDbEntity
 0
ENDBLK
 5
endblk-0
 100
AcDbEntity
 100
AcDbBlockEnd
 0
BLOCK
 2
block-1
 100
AcDbEntity
 0
ENDBLK
 5
endblk-1
 100
AcDbEntity
 100
AcDbBlockEnd
 0
ENDSEC
 0
SECTION
 0
EOF
`.split('\n');

describe('BLOCK section', () => {
    describe('parseBlock', () => {
        it('parseBlock 한 번 실행하고 나면 scanner.next()가 다음 BLOCK의 <0, BLOCK>를 반환한다.', () => {
            const scanner = new DxfArrayScanner(content);
            let curr = scanner.next();

            curr = scanner.next(); // 집어넣을 때 이미 <0, BLOCK>을 소모한 상태여야 함
            parseBlock(curr, scanner);

            curr = scanner.next();

            expect(curr.code).toBe(0);
            expect(curr.value).toBe('BLOCK');
        });

        it('parseBlock은 모든 BLOCK을 소모하여야 한다.', () => {
            const scanner = new DxfArrayScanner(content);
            let curr = scanner.next();

            curr = scanner.next();
            const block0 = parseBlock(curr, scanner);

            curr = scanner.next();
            expect(isMatched(curr, 0, 'BLOCK')).toBeTruthy();

            curr = scanner.next();
            const block1 = parseBlock(curr, scanner);

            expect(block0.name).toBe('block-0');
            expect(block1.name).toBe('block-1');
        });
    });

    describe('parseBlocks', () => {
        it('parseBlocks 한 번 실행하고 나면 scanner.next()가 다음 SECTION의 <0, SECTION>을 반환한다.', () => {
            const scanner = new DxfArrayScanner(content);
            let curr = scanner.next();

            parseBlocks(curr, scanner);

            curr = scanner.next();

            expect(curr.code).toBe(0);
            expect(curr.value).toBe('SECTION');
        });

        it('parseBlocks는 모든 BLOCK을 반환해야 한다.', () => {
            const scanner = new DxfArrayScanner(content);
            let curr = scanner.next();

            const blocks = parseBlocks(curr, scanner);

            expect(blocks['block-0']).toMatchObject({ name: 'block-0' });
            expect(blocks['block-1']).toMatchObject({ name: 'block-1' });
        });
    });
});
