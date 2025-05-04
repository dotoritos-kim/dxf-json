import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    Abort,
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
    ToBoolean,
} from '../../shared/parserGenerator';
import { isMatched } from '../../shared';
import { CommonEntitySnippets } from '../shared';
import { MTextEntityParserSnippets } from '../mtext';
import type { AttributeEntity } from './types';

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

const AttributeSnippets: DXFParserSnippet[] = [
    ...MTextEntityParserSnippets.slice(
        MTextEntityParserSnippets.findIndex(
            ({ name }) => name === 'columnType',
        ),
        MTextEntityParserSnippets.findIndex(
            ({ name }) => name === 'subclassMarker',
        ) + 1,
    ),
    // 67, 8은 common에 있음
    {
        code: 100, // AcDbEntity
    },
    {
        // MTEXT가 필수로 따라오지 않는 경우도 있기 때문에 이 경우 탈출 필요
        code: 0,
        parser(curr) {
            if (!isMatched(curr, 0, 'MTEXT')) return Abort;
            return undefined;
        },
    },
    {
        code: 2,
        name: 'definitionTag',
        parser: Identity,
    },
    {
        code: 40,
        name: 'annotationScale',
        parser: Identity,
    },
    {
        code: 10,
        name: 'alignmentPoint',
        parser: PointParser,
    },
    {
        code: 340,
        name: 'secondaryAttributesHardId',
        parser: Identity,
    },
    {
        code: 70,
        name: 'numberOfSecondaryAttributes',
        parser: Identity,
    },
    {
        code: 70,
        name: 'isReallyLocked',
        parser: ToBoolean,
    },
    {
        code: 70,
        name: 'mtextFlag',
        parser: Identity,
    },
    {
        code: 280,
        name: 'isDuplicatedEntriesKeep',
        parser: ToBoolean,
    },
    {
        code: 100, // AcDbXRecord
    },
    {
        code: 280,
        name: 'lockPositionFlag',
        parser: ToBoolean,
    },
    {
        code: 210,
        name: 'extrusionDirection',
        parser: PointParser,
    },
    {
        code: 11,
        name: 'alignmentPoint',
        parser: PointParser,
    },
    {
        code: 74,
        name: 'verticalJustification',
        parser: Identity,
    },
    {
        code: 72,
        name: 'horizontalJustification',
        parser: Identity,
    },
    {
        code: 71,
        name: 'textGenerationFlag', // attachmentPoint
        parser: Identity,
    },
    {
        code: 7,
        name: 'textStyle',
        parser: Identity,
    },
    {
        code: 51,
        name: 'obliqueAngle',
        parser: Identity,
    },
    {
        code: 41,
        name: 'scale',
        parser: Identity,
    },
    {
        code: 50,
        name: 'rotation',
        parser: Identity,
    },
    {
        code: 73, // 미사용
    },
    {
        code: 70,
        name: 'attributeFlag',
        parser: Identity,
    },
    {
        code: 2,
        name: 'tag',
        parser: Identity,
    },
    {
        code: 280, // version number, 미사용
    },
    {
        code: 100, // AcDbAttribute
        name: 'subclassMarker',
        parser: Identity,
    },
    {
        code: 1,
        name: 'text',
        parser: Identity,
    },
    {
        code: 40,
        name: 'textHeight',
        parser: Identity,
    },
    {
        code: 10,
        name: 'startPoint',
        parser: PointParser,
    },
    {
        code: 39,
        name: 'thickness',
        parser: Identity,
    },
    {
        code: 100, // AcDbText
    },
    ...CommonEntitySnippets,
];

export class AttributeEntityParser {
    static ForEntityName = 'ATTRIB';
    private parser = createParser(AttributeSnippets, DefaultAttributeEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as AttributeEntity;
    }
}
