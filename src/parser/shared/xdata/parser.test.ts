import { describe, it, expect } from 'vitest';
import { DxfArrayScanner } from '../../DxfArrayScanner';
import { parseXData } from './parser';

describe('xdata:parser', () => {
    it('xdata entry를 순차적으로 파싱하여 배열로 반환해야 한다', () => {
        const scanner = new DxfArrayScanner(
            `1001
ACAD
1000
DSTYLE
1070
171
`.split('\n'),
        );
        const curr = scanner.next();
        const result = parseXData(curr, scanner);

        expect(result.appName).toBe('ACAD');
        expect(result.value.length).toBe(2);
        expect(result.value[0].value).toBe('DSTYLE');
        expect(result.value[1].value).toBe(171);
    });

    it('중첩된 xdata entry를 중첩된 배열로 반환해야 한다.', () => {
        const scanner = new DxfArrayScanner(
            `1001
ACAD
1000
a
1002
{
1000
b
1000
c
1002
}
1000
d
`.split('\n'),
        );
        const curr = scanner.next();
        const result = parseXData(curr, scanner);

        expect(result.value).toMatchObject([
            {
                type: 'string',
                value: 'a',
            },
            [
                {
                    type: 'string',
                    value: 'b',
                },
                {
                    type: 'string',
                    value: 'c',
                },
            ],
            {
                type: 'string',
                value: 'd',
            },
        ]);
    });
});
