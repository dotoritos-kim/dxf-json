"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interpreter_1 = require("./interpreter");
describe('xdata:interpreter', () => {
    it('xdata 엔트리들이 name-value 쌍이면 객체에 snippet대로 풀어서 반환한다', () => {
        const interpreter = (0, interpreter_1.createXDataControlInterpreter)([
            {
                code: 40,
                name: '$DIMSCALE',
            },
            {
                code: 172,
                name: 'dim-line-forced',
            },
            {
                code: 175,
                name: 'dim-line-inside',
            },
        ]);
        const result = interpreter([
            {
                value: 40,
            },
            {
                value: 2.0,
            },
            {
                value: 175,
            },
            {
                value: 0,
            },
            {
                value: 172,
            },
            {
                value: 1,
            },
        ]);
        // @ts-ignore
        expect(result['$DIMSCALE']).toBe(2.0);
        // @ts-ignore
        expect(result['dim-line-forced']).toBe(1);
        // @ts-ignore
        expect(result['dim-line-inside']).toBe(0);
    });
    it('snippet에 없는 쌍은 무시한다.', () => {
        const interpreter = (0, interpreter_1.createXDataControlInterpreter)([
            {
                code: 40,
                name: '$DIMSCALE',
                type: 'real',
            },
        ]);
        const result = interpreter([
            {
                value: 175,
            },
            {
                value: 0,
            },
            {
                value: 40,
            },
            {
                value: 2.0,
            },
            {
                value: 172,
            },
            {
                value: 1,
            },
        ]);
        // @ts-ignore
        expect(result['$DIMSCALE']).toBe(2.0);
        // @ts-ignore
        expect(result['dim-line-forced']).toBe(undefined);
        // @ts-ignore
        expect(result['dim-line-inside']).toBe(undefined);
    });
});
//# sourceMappingURL=interpreter.test.js.map