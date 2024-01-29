"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeEntityParser = void 0;
const parserGenerator_1 = require("../../shared/parserGenerator");
const shared_1 = require("../../shared");
const shared_2 = require("../shared");
const mtext_1 = require("../mtext");
const DefaultAttributeEntity = {
    thickness: 0,
    rotation: 0,
    scale: 1,
    obliqueAngle: 0,
    textStyle: 'STANDARD',
    textGenerationFlag: 0,
    horizontalJustification: 0,
    verticalJustification: 0,
    extrusionDirection: { x: 0, y: 0, z: 1 },
};
const AttributeSnippets = [
    ...mtext_1.MTextEntityParserSnippets.slice(mtext_1.MTextEntityParserSnippets.findIndex(({ name }) => name === 'columnType'), mtext_1.MTextEntityParserSnippets.findIndex(({ name }) => name === 'subclassMarker') + 1),
    // 67, 8은 common에 있음
    {
        code: 100, // AcDbEntity
    },
    {
        // MTEXT가 필수로 따라오지 않는 경우도 있기 때문에 이 경우 탈출 필요
        code: 0,
        parser(curr) {
            if (!(0, shared_1.isMatched)(curr, 0, 'MTEXT'))
                return parserGenerator_1.Abort;
            return undefined;
        },
    },
    {
        code: 2,
        name: 'definitionTag',
        parser: parserGenerator_1.Identity,
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
        name: 'secondaryAttributesHardId',
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
        name: 'isDuplicatedEntriesKeep',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 100, // AcDbXRecord
    },
    {
        code: 280,
        name: 'lockPositionFlag',
        parser: parserGenerator_1.ToBoolean,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 11,
        name: 'alignmentPoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 74,
        name: 'verticalJustification',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 72,
        name: 'horizontalJustification',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 71,
        name: 'textGenerationFlag', // attachmentPoint
        parser: parserGenerator_1.Identity,
    },
    {
        code: 7,
        name: 'textStyle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 51,
        name: 'obliqueAngle',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 41,
        name: 'scale',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 50,
        name: 'rotation',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 73, // 미사용
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
        code: 280, // version number, 미사용
    },
    {
        code: 100, // AcDbAttribute
        name: 'subclassMarker',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 1,
        name: 'text',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 40,
        name: 'textHeight',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 10,
        name: 'startPoint',
        parser: parserGenerator_1.PointParser,
    },
    {
        code: 39,
        name: 'thickness',
        parser: parserGenerator_1.Identity,
    },
    {
        code: 100, // AcDbText
    },
    ...shared_2.CommonEntitySnippets,
];
class AttributeEntityParser {
    constructor() {
        this.parser = (0, parserGenerator_1.createParser)(AttributeSnippets, DefaultAttributeEntity);
    }
    parseEntity(scanner, curr) {
        const entity = {};
        this.parser(curr, scanner, entity);
        return entity;
    }
}
exports.AttributeEntityParser = AttributeEntityParser;
AttributeEntityParser.ForEntityName = 'ATTRIB';
//# sourceMappingURL=parser.js.map