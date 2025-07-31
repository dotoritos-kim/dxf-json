import { isMatched } from '@src/parser/shared';
import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
    PointParser,
    ToBoolean,
    Trim,
} from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';
import type { MeshEntity } from './types';


const MeshEntityParserSnippets: DXFParserSnippet[] = [
    {
        code: 90,
        name: 'overridenSubEntityCount',
        parser: Identity,
    },
    {
        code: 140,
        name: 'edgeCreaseWeights',
        parser: Identity,
        isMultiple: true,
    },
    {
        code: 95,
        name: 'edgeCreaseCount',
        parser: Identity,
    },
    {
        code: 94,
        parser(curr, scanner, entity) {
            // it assumes 90 followed by 94 directly
            entity.edgeCount = curr.value
            entity.edgeIndices = []

            for (let i = 0; i < entity.edgeCount; ++i) {
                const edgeIndices: number[] = [];

                curr = scanner.next()
                edgeIndices[0] = curr.value
                curr = scanner.next()
                edgeIndices[1] = curr.value

                entity.edgeIndices.push(edgeIndices)
            }
        }
    },
    {
        code: 93,
        parser(curr, scanner, entity) {
            // it assumes 90 followed by 93 directly
            entity.totalFaceIndices = curr.value
            entity.faceIndices = []

            let count = 0

            // read flattened indices safely then split
            const rawIndices = [] as number[]

            for (let i = 0; i < entity.totalFaceIndices && !isMatched(curr, 0); ++i) {
                curr = scanner.next()
                rawIndices.push(curr.value)
            }

            let pointer = 0
            while (pointer < rawIndices.length) {
                const verticesInCurrentFace = rawIndices[pointer++];
                const faceIndices: number[] = [];
                
                for (let j = 0; j < verticesInCurrentFace; ++j) {
                    faceIndices.push(rawIndices[pointer++]);
                }
                count += verticesInCurrentFace;
                entity.faceIndices.push(faceIndices)
            }
        }
    },
    {
        code: 10,
        name: 'vertices',
        parser: PointParser,
        isMultiple: true,
    },
    {
        code: 92,
        name: 'verticesCount',
        parser: Identity
    },
    {
        code: 91,
        name: 'subdivisionLevel',
        parser: Identity,
    },
    {
        code: 40,
        name: 'blendCrease',
        parser: Identity,
    },
    {
        code: 72,
        name: 'isBlendCreased',
        parser: ToBoolean,
    },
    {
        code: 71,
        name: 'version',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Trim,
        // since there is 92 code in common, context must be pushed
        pushContext: true,
    },
    ...CommonEntitySnippets,
];

export class MeshEntityParser {
    static ForEntityName = 'MESH';
    private parser = createParser(MeshEntityParserSnippets);

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as any;
        this.parser(curr, scanner, entity);
        return entity as MeshEntity;
    }
}