import {
    DXFParserSnippet,
    Identity,
    ToBoolean,
} from '../../shared/parserGenerator';
import type { DictionaryDXFObject } from './types';

export const DictionarySnippets: DXFParserSnippet[] = [
    {
        code: 3,
        name: 'entries',
        parser: (curr, scanner) => {
            const entry = {
                name: curr.value,
            } as DictionaryDXFObject['entries'][0];

            curr = scanner.next();

            if (curr.code === 350) {
                entry.objectId = curr.value;
            } else {
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
        parser: Identity,
    },
    {
        code: 280,
        name: 'isHardOwned',
        parser: ToBoolean,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
];



