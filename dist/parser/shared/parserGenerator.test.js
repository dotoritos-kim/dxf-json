"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DxfArrayScanner_1 = __importDefault(require("../DxfArrayScanner"));
const parserGenerator_1 = require("./parserGenerator");
describe('createParser', () => {
    it('snippet을 소모하고 name이 있으면 object에 넣어야 한다.', () => {
        const parse = (0, parserGenerator_1.createParser)([
            {
                code: 1,
                name: 'a',
                parser: parserGenerator_1.Identity,
            },
            {
                code: 2,
                name: 'b',
                parser: parserGenerator_1.Identity,
            },
            {
                code: 3,
                name: 'c',
                parser: parserGenerator_1.Identity,
            },
        ]);
        const scanner = new DxfArrayScanner_1.default([
            '1',
            'x',
            '2',
            'y',
            '3',
            'z',
            '0',
            'EOF',
        ]);
        const obj = {};
        let curr = scanner.next();
        parse(curr, scanner, obj);
        expect(obj.a).toBe('x');
        expect(obj.b).toBe('y');
        expect(obj.c).toBe('z');
    });
    it('정해진 snippet을 소모하고 나면 파서가 종료해야한다.', () => {
        const parse = (0, parserGenerator_1.createParser)([
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
        const scanner = new DxfArrayScanner_1.default([
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
        const parse = (0, parserGenerator_1.createParser)([
            {
                code: 1,
                name: 'a',
                isMultiple: true,
                parser: parserGenerator_1.Identity,
            },
            {
                code: 2,
                name: 'b',
                parser: parserGenerator_1.Identity,
            },
            {
                code: 3,
                name: 'c',
                parser: parserGenerator_1.Identity,
            },
        ]);
        const scanner = new DxfArrayScanner_1.default([
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
        const obj = {};
        let curr = scanner.next();
        parse(curr, scanner, obj);
        expect(obj.a instanceof Array).toBeTruthy();
        expect(obj.a[0]).toBe('x');
        expect(obj.a[1]).toBe('u');
        curr = scanner.next();
        expect(curr.code).toBe(2);
    });
    it('pushContext가 걸린 경우, 새로 생긴 맥락부터 뒤져본다.', () => {
        const parse = (0, parserGenerator_1.createParser)([
            {
                code: 1,
                name: 'a',
                parser: parserGenerator_1.Identity,
            },
            {
                code: 2,
                name: 'b',
                parser: parserGenerator_1.Identity,
                pushContext: true,
            },
            {
                code: 1,
                name: 'c',
                parser: parserGenerator_1.Identity,
            },
        ]);
        const scanner = new DxfArrayScanner_1.default([
            '1',
            'x',
            '2',
            'y',
            '1',
            'z',
            '0',
            'EOF',
        ]);
        const obj = {};
        let curr = scanner.next();
        parse(curr, scanner, obj);
        expect(obj.a).toBe('z');
        expect(obj.c).toBe('x');
    });
});
//# sourceMappingURL=parserGenerator.test.js.map