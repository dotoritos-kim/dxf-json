import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
    ToBoolean,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { WipeoutEntity } from './types';

const DefaultWipeoutEntity = {
    brightness: 50,
    constrast: 50,
    fade: 0,
}

const WipeoutEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 14,
        name: 'boundary',
        isMultiple: true,
        parser: PointParser
    },
    {
        code: 91,
        name: 'numberOfVertices',
        parser: Identity,
    },
    {
        code: 71,
        name: 'boundaryType',
        parser: Identity, 
    },
    {
        code: 360,
        name: 'imageDefReactorHardId',
        parser: Identity, 
    },
    {
        code: 283,
        name: 'fade',
        parser: Identity,
    },
    {
        code: 282,
        name: 'contrast',
        parser: Identity,
    },
    {
        code: 281,
        name: 'brightness',
        parser: Identity,
    },
    {
        code: 280,
        name: 'isClipping',
        parser: ToBoolean,
    },
    {
        code: 70,
        name: 'displayFlag',
        parser: Identity,
    },
    {
        code: 340,
        name: 'imageDefHardId',
        parser: Identity,
    },
    {
        code: 13,
        name: 'imageSize',
        parser: PointParser,
    },
    {
        code: 12,
        name: 'vDirection',
        parser: PointParser,
    },
    {
        code: 11,
        name: 'uDirection',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'position',
        parser: PointParser,
    },
    {
        code: 90,
        name: 'classVersion',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class WipeoutEntityParser {
    static ForEntityName = 'WIPEOUT';
    private parser = createParser(WipeoutEntityParserSnippets, DefaultWipeoutEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as WipeoutEntity;
    }
}