"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTables = void 0;
const parserGenerator_1 = require("../shared/parserGenerator");
const shared_1 = require("../shared");
const blockRecord_1 = require("./blockRecord");
const dimStyle_1 = require("./dimStyle");
const layer_1 = require("./layer");
const parser_1 = require("./ltype/parser");
const style_1 = require("./style");
const vport_1 = require("./vport");
const TableParsers = {
    BLOCK_RECORD: blockRecord_1.parseBlockRecordTable,
    DIMSTYLE: dimStyle_1.parseDimStyle,
    LAYER: layer_1.parseLayerTable,
    LTYPE: parser_1.parseLTypeTable,
    STYLE: style_1.parseStyleTable,
    VPORT: vport_1.parseVPortTable,
};
const CommonTableParserSnippets = [
    {
        code: 70,
        name: 'maxNumberOfEntries',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 330,
        name: 'ownerObjectId',
        parser: parserGenerator_1.Identity,
    },
    {
        // ACAD_XDICTIONARY, ignore
        code: 102,
    },
    {
        code: 360,
        isMultiple: true,
    },
    {
        code: 102,
    },
    {
        code: 5,
        name: 'handle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 2,
        name: 'name',
        parser: parserGenerator_1.Identity,
    },
];
const parseCommonTable = (0, parserGenerator_1.createParser)(CommonTableParserSnippets);
function parseTables(curr, scanner) {
    var _a;
    const tables = {};
    while (!(0, shared_1.isMatched)(curr, 0, 'EOF')) {
        if ((0, shared_1.isMatched)(curr, 0, 'ENDSEC'))
            break;
        if ((0, shared_1.isMatched)(curr, 0, 'TABLE')) {
            curr = scanner.next();
            const table = { entries: [] };
            parseCommonTable(curr, scanner, table);
            tables[table.name] = table;
        }
        if ((0, shared_1.isMatched)(curr, 0) && !(0, shared_1.isMatched)(curr, 0, 'ENDTAB')) {
            const name = curr.value;
            curr = scanner.next();
            // @ts-ignore
            const parseTable = TableParsers[name];
            if (!parseTable) {
                console.warn(`parseTable: Invalid table name '${name}'`);
                curr = scanner.next();
                continue;
            }
            const record = {};
            parseTable(curr, scanner, record);
            (_a = tables[name]) === null || _a === void 0 ? void 0 : _a.entries.push(record);
        }
        curr = scanner.next();
    }
    return tables;
}
exports.parseTables = parseTables;
//# sourceMappingURL=parser.js.map