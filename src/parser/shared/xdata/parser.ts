import type { Point3D } from '../../../types';
import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner';
import { isMatched } from '../isMatched';
import { parsePoint } from '../parsePoint';
import { DXFParserSnippet } from '../parserGenerator';
import type { XData, XDataEntry } from './types';

export const XDataParserSnippets: DXFParserSnippet[] = [
    {
        code: 1001,
        name: 'xdata',
        isMultiple: true,
        parser: parseXData,
    },
];

const PointCodes = new Set([1010, 1011, 1012, 1013]);

export function parseXData(curr: ScannerGroup, scanner: DxfArrayScanner): XData {
    if (!isMatched(curr, 1001)) {
        throw new Error('XData must starts with code 1001');
    }

    const xdata: XData = {
        appName: curr.value,
        value: [],
    };

    curr = scanner.next();

    const stack: XDataEntry[][] = [xdata.value]

    while (!isMatched(curr, 0, 'EOF') && !isMatched(curr, 1001) && curr.code >= 1000) {
        const top = stack[stack.length - 1];

        if (curr.code === 1002) {
            if (curr.value === '{') {
                stack.push([]);
            } else {
                stack.pop();
                stack[stack.length - 1]?.push(top);
            }
            curr = scanner.next();
            continue
        }
        
        if (PointCodes.has(curr.code)) {
            top.push(parsePoint(scanner) as Point3D)
        } else {
            top.push(curr.value)
        }
        curr = scanner.next();
    }

    scanner.rewind();
    return xdata;
}