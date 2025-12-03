import { describe, expect, test } from 'vitest';
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../../DxfArrayScanner.ts'
import { XDataParserSnippets,  } from './parser.ts'
import { createParser } from '../parserGenerator.ts'
import type { XData } from './types.ts'

describe('xdata:parser', () => {
    test('tc0', () => {
        const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8')
        const scanner = new DxfArrayScanner(content.split('\n'))
        const parse = createParser(XDataParserSnippets)

        let curr = scanner.next() 

        const placeholder = {} as any

        parse(curr, scanner, placeholder)
        
        expect(placeholder).toMatchObject<{ xdata: XData[] }>({
            xdata: [
                {
                    appName: 'ACAD',
                    value: [
                        'DSTYLE',
                        [
                            288,
                            1,
                        ],
                    ]
                },
                {
                    appName: 'ACAD_DSTYLE_DIMRADIAL_EXTENSION',
                    value: [
                        387,
                        1,
                        388,
                        0.0,
                        390,
                        0.0,
                    ]
                }
            ]
        })
    })

    test('tc1', () => {
        const content = readFileSync(join(__dirname, './tc1.partial_dxf'), 'utf-8')
        const scanner = new DxfArrayScanner(content.split('\n'))
        const parse = createParser(XDataParserSnippets)

        let curr = scanner.next() 

        const placeholder = {} as any

        parse(curr, scanner, placeholder)
        
        expect(placeholder).toMatchObject<{ xdata: XData[] }>({
            xdata: [
                {
                    appName: 'ACAD',
                    value: [
                        'DSTYLE',
                        [
                            40,
                            5.0,
                            173,
                            1,
                            271,
                            4,
                            342,
                            '0',
                            343,
                            '29E1C',
                            344,
                            '29E1C'
                        ]
                    ]
                },
            ]
        })
    })
});
