export type * from './types'
export * from './dictionary'
export * from './layout'
export * from './plotSettings'

import type DxfArrayScanner from '../DxfArrayScanner';
import { ScannerGroup } from '../DxfArrayScanner';
import { createParser, DXFParserSnippet } from '../shared/parserGenerator';
import { LayoutSnippets } from './layout';
import { CommonObjectSnippets } from './shared';
import { PlotSettingsSnippets } from './plotSettings';
import { DictionarySnippets } from './dictionary'
import { createObjectTree } from './treefy';
import { classify } from '../../utils';

const ObjectSchemas: Record<string, DXFParserSnippet[]> = {
    LAYOUT: LayoutSnippets,
    PLOTSETTINGS: PlotSettingsSnippets,
    DICTIONARY: DictionarySnippets,
};

export function parseObjects(curr: ScannerGroup, scanner: DxfArrayScanner) {
    const result = [] as any[];

    while (curr.code !== 0 || !['EOF', 'ENDSEC'].includes(curr.value)) {
        const objectName = curr.value as string;
        const snippets = ObjectSchemas[objectName];

        if (curr.code === 0 && snippets?.length) {
            const parser = createParser([...CommonObjectSnippets, ...snippets]);
            const parsedObject = { name: objectName } as any;

            curr = scanner.next();

            if (parser(curr, scanner, parsedObject)) {
                result.push(parsedObject);
                curr = scanner.peek();
            } else {
                curr = scanner.next();
            }
        } else {
            curr = scanner.next();
        }
    }

    return {
        byName: classify(result, ({ name }) => name),
        byTree: createObjectTree(result),
    };
}
