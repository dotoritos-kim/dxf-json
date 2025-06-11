import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import { createParser, DXFParserSnippet } from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import { SeqendEntity } from './types';

const DefaultSeqendEntity: SeqendEntity = {
    type: 'SEQEND',
    handle: '',
    layer: '',
    // Optionally, add ownerHandle: '', and others if required by your CommonDxfEntity
};


const SeqendParserSnippets: DXFParserSnippet[] = [
    ...CommonEntitySnippets,
];

export class SeqendEntityParser {
    static ForEntityName = 'SEQEND';

    private parser = createParser(SeqendParserSnippets, DefaultSeqendEntity);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity;
    }
}
