import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
    ToBoolean,
} from '../../shared/parserGenerator';
import { DefaultTextEntity, TextEntityParserSnippets } from '../text';
import type { AttdefEntity } from './types';

const DefaultAttDefEntity = {
    ...DefaultTextEntity,
};

const AttDefEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 2, // tag. 왜 다시 나오는지 모르겠음
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
        name: 'secondaryAttributesHardIds',
        isMultiple: true,
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
        name: 'isDuplicatedRecord',
        parser: ToBoolean,
    },
    {
        code: 100, // AcDbXrecord, skip
    },
    {
        code: 280,
        name: 'isLocked',
        parser: ToBoolean,
    },
    {
        code: 74,
        name: 'valign',
        parser: Identity,
    },
    {
        code: 73, // field length, useless
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
        code: 3,
        name: 'prompt',
        parser: Identity,
    },
    {
        code: 280, // version number, always 0, useless
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...TextEntityParserSnippets.slice(2),
];

export class AttDefEntityParser {
    static ForEntityName = 'ATTDEF';
    private parser = createParser(
        AttDefEntityParserSnippets,
        DefaultAttDefEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as AttdefEntity;
    }
}

// entity.invisible = !!(curr.value & 0x01);
// entity.constant = !!(curr.value & 0x02);
// entity.verificationRequired = !!(curr.value & 0x04);
// entity.preset = !!(curr.value & 0x08);

// entity.backwards = !!(curr.value & 0x02);
// entity.mirrored = !!(curr.value & 0x04);
