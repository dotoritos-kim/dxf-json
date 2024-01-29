"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseObjects = void 0;
const parserGenerator_1 = require("../shared/parserGenerator");
const layout_1 = require("./layout");
const common_1 = require("./common");
const plotSettings_1 = require("./plotSettings");
const dictionary_1 = require("./dictionary");
const treefy_1 = require("./treefy");
const utils_1 = require("../../utils");
const ObjectSchemas = {
    LAYOUT: layout_1.LayoutSnippets,
    PLOTSETTINGS: plotSettings_1.PlotSettingsSnippets,
    DICTIONARY: dictionary_1.DictionarySnippets,
};
function parseObjects(curr, scanner) {
    const result = [];
    while (curr.code !== 0 || !['EOF', 'ENDSEC'].includes(curr.value)) {
        const objectName = curr.value;
        const snippets = ObjectSchemas[objectName];
        if (curr.code === 0 && (snippets === null || snippets === void 0 ? void 0 : snippets.length)) {
            const parser = (0, parserGenerator_1.createParser)([...common_1.CommonObjectSnippets, ...snippets]);
            const parsedObject = { name: objectName };
            curr = scanner.next();
            if (parser(curr, scanner, parsedObject)) {
                result.push(parsedObject);
                curr = scanner.peek();
            }
            else {
                curr = scanner.next();
            }
        }
        else {
            curr = scanner.next();
        }
    }
    return {
        byName: (0, utils_1.classify)(result, ({ name }) => name),
        byTree: (0, treefy_1.createObjectTree)(result),
    };
}
exports.parseObjects = parseObjects;
//# sourceMappingURL=index.js.map