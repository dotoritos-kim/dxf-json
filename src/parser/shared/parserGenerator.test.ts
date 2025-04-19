import DxfArrayScanner from '../DxfArrayScanner';
import { createParser, Identity } from './parserGenerator';

describe('createParser', () => {
    it('snippet을 소모하고 name이 있으면 object에 넣어야 한다.', () => {
        const parse = createParser([
            {
                code: 1,
                name: 'a',
                parser: Identity,
            },
            {
                code: 2,
                name: 'b',
                parser: Identity,
            },
            {
                code: 3,
                name: 'c',
                parser: Identity,
            },
        ]);

        const scanner = new DxfArrayScanner([
            '1',
            'x',
            '2',
            'y',
            '3',
            'z',
            '0',
            'EOF',
        ]);

        const obj = {} as any;
        let curr = scanner.next();
        parse(curr, scanner, obj);

        expect(obj.a).toBe('x');
        expect(obj.b).toBe('y');
        expect(obj.c).toBe('z');
    });

    it('정해진 snippet을 소모하고 나면 파서가 종료해야한다.', () => {
        const parse = createParser([
            {
                code: 1,
            },
            {
                code: 2,
            },
            {
                code: 3,
            },
        ]);

        const scanner = new DxfArrayScanner([
            '1',
            '',
            '2',
            '',
            '3',
            '',
            '1',
            '',
            '2',
            '',
            '0',
            'EOF',
        ]);

        let curr = scanner.next();
        parse(curr, scanner, {});

        curr = scanner.next();
        expect(curr.code).toBe(1);
    });

    it('isMultiple이 걸린 경우 snippet을 소모해선 안된다', () => {
        const parse = createParser([
            {
                code: 1,
                name: 'a',
                isMultiple: true,
                parser: Identity,
            },
            {
                code: 2,
                name: 'b',
                parser: Identity,
            },
            {
                code: 3,
                name: 'c',
                parser: Identity,
            },
        ]);

        const scanner = new DxfArrayScanner([
            '1',
            'x',
            '2',
            'y',
            '3',
            'z',
            '1',
            'u',
            '2',
            'v',
            '0',
            'EOF',
        ]);

        const obj = {} as any;
        let curr = scanner.next();
        parse(curr, scanner, obj);

        expect(obj.a instanceof Array).toBeTruthy();
        expect(obj.a[0]).toBe('x');
        expect(obj.a[1]).toBe('u');

        curr = scanner.next();
        expect(curr.code).toBe(2);
    });

    describe('isReducible', () => {
        it('should return multiple values as array when isReducible is false', () => {
            const parse = createParser([
                {
                    code: 1,
                    name: 'a',
                    isMultiple: true,
                    parser: Identity,
                },
            ]);

            const scanner = new DxfArrayScanner([
                '1',
                'x',
                '1',
                'x',
                'EOF',
            ]);

            const obj = {} as any;
            let curr = scanner.next();
            parse(curr, scanner, obj);

            expect(obj.a instanceof Array).toBeTruthy();
        })

        it('should return reduced single value when isReducible is true', () => {
            const parse = createParser([
                {
                    code: 10,
                    name: 'a',
                    isMultiple: true,
                    isReducible: true,
                    // replace as sum with its previous value
                    parser: (curr, _, obj) => (obj.a ?? 0) + curr.value,
                },
            ]);

            const scanner = new DxfArrayScanner([
                '10',
                '1',
                '10',
                '2',
                'EOF',
            ]);

            const obj = {} as any;
            let curr = scanner.next();
            parse(curr, scanner, obj);

            expect(obj.a instanceof Array).toBeFalsy();
            expect(obj.a).toBe(3)
        })
    })

    it('pushContext가 걸린 경우, 새로 생긴 맥락부터 뒤져본다.', () => {
        const parse = createParser([
            {
                code: 1,
                name: 'a',
                parser: Identity,
            },
            {
                code: 2,
                name: 'b',
                parser: Identity,
                pushContext: true,
            },
            {
                code: 1,
                name: 'c',
                parser: Identity,
            },
        ]);

        const scanner = new DxfArrayScanner([
            '1',
            'x',
            '2',
            'y',
            '1',
            'z',
            '0',
            'EOF',
        ]);

        const obj = {} as any;
        let curr = scanner.next();
        parse(curr, scanner, obj);

        expect(obj.a).toBe('z');
        expect(obj.c).toBe('x');
    });
});
