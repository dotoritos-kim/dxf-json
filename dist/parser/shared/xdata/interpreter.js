"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createXDataCatcher = exports.createXDataControlInterpreter = void 0;
/**
 * xdata가 code-value의 연속인 경우에 사용 가능
 * ex) DSTYLE
 */
function createXDataControlInterpreter(snippets) {
    return (entries) => {
        var _a;
        const result = {};
        for (let i = 0; i < entries.length; i += 2) {
            const snippet = snippets.find(({ code }) => code === entries[i].value);
            if (!snippet)
                continue;
            // @ts-ignore
            result[snippet.name] = (_a = entries[i + 1]) === null || _a === void 0 ? void 0 : _a.value;
        }
        return result;
    };
}
exports.createXDataControlInterpreter = createXDataControlInterpreter;
function createXDataCatcher({ appName = 'ACAD', catcher, escaper, }) {
    return function* (xdata) {
        if ((xdata === null || xdata === void 0 ? void 0 : xdata.appName) !== appName)
            return;
        let isCatchable = false;
        let startIndex = -1;
        for (const [index, entry] of xdata.value.entries()) {
            if (isCatchable) {
                yield entry;
                if (escaper === null || escaper === void 0 ? void 0 : escaper(entry, index - startIndex))
                    return;
            }
            else if (catcher(entry)) {
                isCatchable = true;
                startIndex = index;
            }
        }
    };
}
exports.createXDataCatcher = createXDataCatcher;
//# sourceMappingURL=interpreter.js.map