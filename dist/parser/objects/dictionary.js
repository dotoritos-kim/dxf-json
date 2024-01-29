"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordCloneFlag = exports.DictionarySnippets = void 0;
const parserGenerator_1 = require("../shared/parserGenerator");
exports.DictionarySnippets = [
    {
        code: 3,
        name: 'entries',
        parser: (curr, scanner) => {
            const entry = {
                name: curr.value,
            };
            curr = scanner.next();
            if (curr.code === 350) {
                entry.objectId = curr.value;
            }
            else {
                // 만약 본인 토큰 아니면 스트림에 되돌려놔야 함
                scanner.rewind();
            }
            return entry;
        },
        isMultiple: true,
    },
    {
        code: 281,
        name: 'recordCloneFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 280,
        name: 'isHardOwned',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
];
var RecordCloneFlag;
(function (RecordCloneFlag) {
    RecordCloneFlag[RecordCloneFlag["NOT_APPLICABLE"] = 0] = "NOT_APPLICABLE";
    RecordCloneFlag[RecordCloneFlag["KEEP_EXISTING"] = 1] = "KEEP_EXISTING";
    RecordCloneFlag[RecordCloneFlag["USE_CLONE"] = 2] = "USE_CLONE";
    RecordCloneFlag[RecordCloneFlag["XREF_VALUE_NAME"] = 3] = "XREF_VALUE_NAME";
    RecordCloneFlag[RecordCloneFlag["VALUE_NAME"] = 4] = "VALUE_NAME";
    RecordCloneFlag[RecordCloneFlag["UNMANGLE_NAME"] = 5] = "UNMANGLE_NAME";
})(RecordCloneFlag || (exports.RecordCloneFlag = RecordCloneFlag = {}));
//# sourceMappingURL=dictionary.js.map