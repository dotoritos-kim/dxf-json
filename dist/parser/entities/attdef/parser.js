"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttDefEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const text_1 = require("../text");
const DefaultAttDefEntity = {
    ...text_1.DefaultTextEntity,
};
const AttDefEntityParserSnippets = [
    {
        code: 2, // tag. 왜 다시 나오는지 모르겠음
    },
    {
        code: 40,
        name: 'annotationScale',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'alignmentPoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 340,
        name: 'secondaryAttributesHardIds',
        isMultiple: true,
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'numberOfSecondaryAttributes',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 70,
        name: 'isReallyLocked',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 70,
        name: 'mtextFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 280,
        name: 'isDuplicatedRecord',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 100, // AcDbXrecord, skip
    },
    {
        code: 280,
        name: 'isLocked',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 74,
        name: 'valign',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 73, // field length, useless
    },
    {
        code: 70,
        name: 'attributeFlag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 2,
        name: 'tag',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 3,
        name: 'prompt',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 280, // version number, always 0, useless
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    ...text_1.TextEntityParserSnippets.slice(2),
];
class AttDefEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(AttDefEntityParserSnippets, DefaultAttDefEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.AttDefEntityParser = AttDefEntityParser;
AttDefEntityParser.ForEntityName = 'ATTDEF';
// entity.invisible = !!(curr.value & 0x01);
// entity.constant = !!(curr.value & 0x02);
// entity.verificationRequired = !!(curr.value & 0x04);
// entity.preset = !!(curr.value & 0x08);
// entity.backwards = !!(curr.value & 0x02);
// entity.mirrored = !!(curr.value & 0x04);
//# sourceMappingURL=parser.js.map