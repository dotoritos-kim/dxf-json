import fs from "fs";
import DxfArrayScanner from './DxfArrayScanner';
import { parseHeader } from './header';
import { parseTables } from './tables';
import { parseBlocks } from './blocks';
import { parseEntities } from './entities';
import { parseObjects } from './objects';
import { isMatched } from './shared';
import { filterDummyBlocks } from './filterDummyBlocks';
import type { ParsedDxf } from './types';
import { Readable } from 'readable-stream';
export default class DxfParser {
    parseSync(dxfString: string) {
        const dxfLinesArray = dxfString.split(/\r\n|\r|\n/g);
        const scanner = new DxfArrayScanner(dxfLinesArray);
        if (!scanner.hasNext()) {
            throw Error('Empty file');
        }

        return this.parseAll(scanner);
    }
    parseStream(stream: Readable | fs.ReadStream) {
        let dxfString = "";
        const self = this;
        return new Promise<ParsedDxf>((res, rej) => {
            stream.on('data', (chunk) => {
                dxfString += chunk;
            });
            stream.on('end', () => {
                try {
                    const dxfLinesArray = dxfString.split(/\r\n|\r|\n/g);
                    const scanner = new DxfArrayScanner(dxfLinesArray);
                    if (!scanner.hasNext()) {
                        throw Error('Empty file');
                    }
                    res(self.parseAll(scanner));
                } catch (err) {
                    rej(err);
                }
            });
            stream.on('error', (err) => {
                rej(err);
            });
        });
    }

    async parseFromUrl(url: string, encoding = "utf-8", init?: RequestInit | undefined) {
        const response = await fetch(url, init)

        if (!response.body) return null;

        const reader = response.body.getReader()
        let buffer = ""
        let decoder = new TextDecoder(encoding)

        while (true) {
            const { done, value } = await reader.read()
            if (done) {
                buffer += decoder.decode(new ArrayBuffer(0), { stream: false })
                break
            }
            buffer += decoder.decode(value, { stream: true })
        }
        return this.parseSync(buffer)
    }


    parseAll(scanner: DxfArrayScanner) {
        const dxf: ParsedDxf = {
            // @ts-ignore
            header: {},
            blocks: {},
            entities: [],
            tables: {},
            objects: {
                byName: {},
                byTree: undefined,
            },
        };
        let curr = scanner.next();

        while (!isMatched(curr, 0, 'EOF')) {
            if (isMatched(curr, 0, 'SECTION')) {
                curr = scanner.next();

                if (isMatched(curr, 2, 'HEADER')) {
                    curr = scanner.next();
                    dxf.header = parseHeader(curr, scanner);
                } else if (isMatched(curr, 2, 'BLOCKS')) {
                    curr = scanner.next();
                    dxf.blocks = parseBlocks(curr, scanner);
                }
                else if (isMatched(curr, 2, 'ENTITIES')) {
                    curr = scanner.next();
                    dxf.entities = parseEntities(curr, scanner);
                }
                else if (isMatched(curr, 2, 'TABLES')) {
                    curr = scanner.next();
                    dxf.tables = parseTables(curr, scanner);
                } else if (isMatched(curr, 2, 'OBJECTS')) {
                    curr = scanner.next();
                    dxf.objects = parseObjects(curr, scanner);
                }
            }
            curr = scanner.next();
        }
        return filterDummyBlocks(dxf);
    }
}
