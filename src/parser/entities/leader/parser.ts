import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
    ToBoolean,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { LeaderEntity } from './types';

const DefaultLeaderEntity = {
    isArrowheadEnabled: true,
};

const LeaderEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 213,
        name: 'offsetFromAnnotation',
        parser: PointParser,
    },
    {
        code: 212,
        name: 'offsetFromBlock',
        parser: PointParser,
    },
    {
        code: 211,
        name: 'horizontalDirection',
        parser: PointParser,
    },
    {
        code: 210,
        name: 'normal',
        parser: PointParser,
    },
    {
        code: 340,
        name: 'associatedAnnotation',
        parser: Identity,
    },
    {
        code: 77,
        name: 'byBlockColor',
        parser: Identity,
    },
    {
        code: 10,
        name: 'vertices',
        parser: PointParser,
        isMultiple: true,
    },
    {
        code: 76,
        name: 'numberOfVertices',
        parser: Identity,
    },
    {
        code: 41,
        name: 'textWidth',
        parser: Identity,
    },
    {
        code: 40,
        name: 'textHeight',
        parser: Identity,
    },
    {
        code: 75,
        name: 'isHooklineExists',
        parser: ToBoolean,
    },
    {
        code: 74,
        name: 'isHooklineSameDirection',
        parser: ToBoolean,
    },
    {
        code: 73,
        name: 'leaderCreationFlag',
        parser: Identity,
    },
    {
        code: 72,
        name: 'isSpline',
        parser: ToBoolean,
    },
    {
        code: 71,
        name: 'isArrowheadEnabled',
        parser: ToBoolean,
    },
    {
        code: 3,
        name: 'styleName',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class LeaderEntityParser {
    static ForEntityName = 'LEADER';
    private parser = createParser(
        LeaderEntityParserSnippets,
        DefaultLeaderEntity,
    );

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as LeaderEntity;
    }
}
