import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets, createLongStringSnippet } from '../shared';
import type { BodyEntity } from './types';

const DefaultBodyEntity = {
    modelerFormatVersionNumber: 1,
    proprietaryData: [],
};

const BodyEntityParserSnippets: DXFParserSnippet[] = [
    ...createLongStringSnippet('data'),
    {
        code: 70,
        name: 'formatVersion',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonEntitySnippets,
];

export class BodyEntityParser {
    static ForEntityName = 'BODY';
    private parser = createParser(BodyEntityParserSnippets, DefaultBodyEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as BodyEntity;
    }
}