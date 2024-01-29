"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseXData = exports.XDataParserSnippets = void 0;
const __1 = require("..");
const parsePoint_1 = require("../parsePoint");
exports.XDataParserSnippets = [
    {
        code: 1001,
        name: 'xdata',
        parser: parseXData,
    },
];
function parseXData(curr, scanner) {
    var _a;
    if (!(0, __1.isMatched)(curr, 1001)) {
        throw new Error('XData must starts with code 1001');
    }
    const xdata = {
        appName: curr.value,
        value: [],
    };
    curr = scanner.next();
    const stack = [xdata.value];
    while (!(0, __1.isMatched)(curr, 0, 'EOF') && curr.code >= 1000) {
        const top = stack.at(-1);
        switch (curr.code) {
            case 1002:
                if (curr.value === '{') {
                    stack.push([]);
                }
                else {
                    stack.pop();
                    (_a = stack.at(-1)) === null || _a === void 0 ? void 0 : _a.push(top);
                }
                break;
            case 1000: // string
            case 1004: // hex string
            case 1040: // real
            case 1070: // integer
            case 1071: // long
                top.push({
                    type: getType(curr.code),
                    value: curr.value,
                });
                break;
            case 1003:
                top.push({
                    name: 'layer',
                    type: getType(curr.code),
                    value: curr.value,
                });
                break;
            case 1005:
                top.push({
                    name: 'handle',
                    type: getType(curr.code),
                    value: curr.value,
                });
                break;
            case 1010: // just 3 reals
                top.push({
                    type: getType(curr.code),
                    value: (0, parsePoint_1.parsePoint)(scanner),
                });
                break;
            case 1011:
                top.push({
                    name: 'worldSpacePosition',
                    type: getType(curr.code),
                    value: (0, parsePoint_1.parsePoint)(scanner),
                });
                break;
            case 1012:
                top.push({
                    name: 'worldSpaceDisplacement',
                    type: getType(curr.code),
                    value: (0, parsePoint_1.parsePoint)(scanner),
                });
                break;
            case 1013:
                top.push({
                    name: 'worldSpaceDirection',
                    type: getType(curr.code),
                    value: (0, parsePoint_1.parsePoint)(scanner),
                });
                break;
            case 1041:
                top.push({
                    name: 'distance',
                    type: getType(curr.code),
                    value: curr.value,
                });
                break;
            case 1042:
                top.push({
                    name: 'scale',
                    type: getType(curr.code),
                    value: curr.value,
                });
                break;
        }
        curr = scanner.next();
    }
    scanner.rewind();
    return xdata;
}
exports.parseXData = parseXData;
function getType(code) {
    switch (code) {
        case 1000:
        case 1003:
        case 1005:
            return 'string';
        case 1004:
            return 'hex';
        case 1040:
        case 1041:
        case 1042:
            return 'real';
        case 1070:
            return 'integer';
        case 1071:
            return 'long';
        case 1010:
        case 1011:
        case 1012:
        case 1013:
            return 'point';
        default:
            return '';
    }
}
//# sourceMappingURL=parser.js.map