import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import {
    createParser,
    DXFParserSnippet,
    Identity,
} from '../../shared/parserGenerator';

const PatternDataSnippets: DXFParserSnippet[] = [
    {
        code: 49,
        name: 'dashLengths',
        parser: Identity,
        isMultiple: true,
    },
    {
        code: 79,
        name: 'numberOfDashLengths',
        parser: Identity,
    },
    {
        code: 45,
        name: 'offset',
        parser: pseudoPointParser,
    },
    {
        code: 43,
        name: 'base',
        parser: pseudoPointParser,
    },
    {
        code: 53,
        name: 'angle',
        parser: Identity,
    },
];

function pseudoPointParser(curr: ScannerGroup, scanner: DxfArrayScanner) {
    const nextCode = curr.code + 1;
    const offset = {
        x: curr.value,
        y: 1,
    };
    curr = scanner.next();
    if (curr.code === nextCode) {
        offset.y = curr.value;
    } else {
        scanner.rewind();
    }
    return offset;
}

export function parsePatternData(curr: ScannerGroup, scanner: DxfArrayScanner) {
    const patternData: any = {};
    createParser(PatternDataSnippets)(curr, scanner, patternData);
    return patternData;
}
