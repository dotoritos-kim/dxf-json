import { parsePoint } from '../../../shared/parsePoint';
import {
    type DXFParserSnippet,
    Identity,
    ToBoolean,
} from '../../../shared/parserGenerator';
import { CommonBoundaryPathDataSnippets } from './shared';

export const PolylineSnippets: DXFParserSnippet[] = [
    ...CommonBoundaryPathDataSnippets,
    {
        code: 10,
        name: 'vertices',
        parser(curr, scanner) {
            const vertex = { ...parsePoint(scanner), bulge: 0 };

            curr = scanner.next();
            if (curr.code === 42) {
                vertex.bulge = curr.value;
            } else {
                scanner.rewind();
            }

            return vertex;
        },
        isMultiple: true,
    },
    {
        code: 93,
        name: 'numberOfVertices',
        parser: Identity,
    },
    {
        code: 73,
        name: 'isClosed',
        parser: ToBoolean,
    },
    {
        code: 72,
        name: 'hasBulge',
        parser: ToBoolean,
    },
];
