import { DXFParserSnippet, Identity } from '../../../shared/parserGenerator';

export const CommonBoundaryPathDataSnippets: DXFParserSnippet[] = [
    {
        code: 330,
        name: 'sourceBoundaryObjects',
        parser: Identity,
        isMultiple: true,
    },
    {
        code: 97,
        name: 'numberOfSourceBoundaryObjects',
        parser: Identity,
    },
    // 92는 분기에 써야해서 외부에서 주입함
];
