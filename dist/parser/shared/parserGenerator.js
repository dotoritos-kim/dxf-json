"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToBoolean = exports.PointParser = exports.Identity = exports.createParser = exports.Abort = void 0;
const _1 = require(".");
const parsePoint_1 = require("./parsePoint");
exports.Abort = Symbol();
function createParser(snippets, defaultObject) {
    return (curr, scanner, target) => {
        const snippetMaps = createSnippetMaps(snippets);
        let isReadOnce = false;
        let contextIndex = snippetMaps.length - 1;
        while (!(0, _1.isMatched)(curr, 0, 'EOF')) {
            const snippetMap = findSnippetMap(snippetMaps, curr.code, contextIndex);
            const snippet = snippetMap === null || snippetMap === void 0 ? void 0 : snippetMap[curr.code].at(-1);
            if (!snippetMap || !snippet) {
                scanner.rewind();
                break;
            }
            if (!snippet.isMultiple) {
                snippetMap[curr.code].pop();
            }
            const { name, parser, isMultiple } = snippet;
            const parsedValue = parser === null || parser === void 0 ? void 0 : parser(curr, scanner, target);
            if (parsedValue === exports.Abort) {
                scanner.rewind();
                break;
            }
            if (name) {
                const [leaf, fieldName] = getObjectByPath(target, name);
                if (isMultiple) {
                    // prototype으로 디폴트값 넣어준 경우 nullish coalescing으로 해결 안됨 
                    // @ts-ignore
                    if (!Object.hasOwn(leaf, fieldName)) {
                        leaf[fieldName] = [];
                    }
                    leaf[fieldName].push(parsedValue);
                }
                else {
                    leaf[fieldName] = parsedValue;
                }
            }
            if (snippet.pushContext) {
                contextIndex -= 1;
            }
            isReadOnce = true;
            curr = scanner.next();
        }
        if (defaultObject) {
            Object.setPrototypeOf(target, defaultObject);
        }
        return isReadOnce;
    };
}
exports.createParser = createParser;
function createSnippetMaps(snippets) {
    return snippets.reduce((acc, snippet) => {
        var _a;
        if (snippet.pushContext) {
            acc.push({});
        }
        const context = acc[acc.length - 1];
        const codes = typeof snippet.code === 'number'
            ? [snippet.code]
            : snippet.code;
        for (const code of codes) {
            const bin = ((_a = context[code]) !== null && _a !== void 0 ? _a : (context[code] = []));
            if (snippet.isMultiple && bin.length) {
                console.warn(`Snippet ${bin.at(-1).name} for code(${code}) is shadowed by ${snippet.name}`);
            }
            bin.push(snippet);
        }
        return acc;
    }, [{}]);
}
function findSnippetMap(snippetMaps, code, contextIndex) {
    return snippetMaps.find((map, index) => { var _a; return index >= contextIndex && ((_a = map[code]) === null || _a === void 0 ? void 0 : _a.length); });
}
/**
 * path를 .으로 나누고, 그 서브패스의 값을 설정할 수 있게 함.
 * 값이 없으면 알아서 만듦
 *
 * ex) a.b -> target[a]를 반환하여 b를 대입할 수 있게 함
 *     a.b.c -> target[a][b]를 반환하여 c를 대입할 수 있게 함
 *
 * @param target .으로 구분된 경로
 * @param path
 * @return [finalTargetObject, name]
 */
function getObjectByPath(target, path) {
    const fragments = path.split('.');
    let currentTarget = target;
    for (let depth = 0; depth < fragments.length - 1; ++depth) {
        const currentName = fragments[depth];
        // @ts-ignore
        if (!Object.hasOwn(currentTarget, currentName)) {
            currentTarget[currentName] = {};
        }
        currentTarget = currentTarget[currentName];
    }
    return [currentTarget, fragments.at(-1)];
}
function Identity({ value }) {
    return value;
}
exports.Identity = Identity;
function PointParser(_, scanner) {
    return (0, parsePoint_1.parsePoint)(scanner);
}
exports.PointParser = PointParser;
function ToBoolean({ value }) {
    return !!value;
}
exports.ToBoolean = ToBoolean;
//# sourceMappingURL=parserGenerator.js.map