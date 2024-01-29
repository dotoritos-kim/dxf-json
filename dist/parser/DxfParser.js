"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DxfArrayScanner_1 = __importDefault(require("./DxfArrayScanner"));
const header_1 = require("./header");
const tables_1 = require("./tables");
const blocks_1 = require("./blocks");
const entities_1 = require("./entities");
const objects_1 = require("./objects");
const shared_1 = require("./shared");
const filterDummyBlocks_1 = require("./filterDummyBlocks");
class DxfParser {
    parseSync(dxfString) {
        const dxfLinesArray = dxfString.split(/\r\n|\r|\n/g);
        const scanner = new DxfArrayScanner_1.default(dxfLinesArray);
        if (!scanner.hasNext()) {
            throw Error('Empty file');
        }
        return this.parseAll(scanner);
    }
    parseStream(stream) {
        let dxfString = "";
        const self = this;
        return new Promise((res, rej) => {
            stream.on('data', (chunk) => {
                dxfString += chunk;
            });
            stream.on('end', () => {
                try {
                    const dxfLinesArray = dxfString.split(/\r\n|\r|\n/g);
                    const scanner = new DxfArrayScanner_1.default(dxfLinesArray);
                    if (!scanner.hasNext()) {
                        throw Error('Empty file');
                    }
                    res(self.parseAll(scanner));
                }
                catch (err) {
                    rej(err);
                }
            });
            stream.on('error', (err) => {
                rej(err);
            });
        });
    }
    async parseFromUrl(url, encoding = "utf-8", init) {
        const response = await fetch(url, init);
        if (!response.body)
            return null;
        const reader = response.body.getReader();
        let buffer = "";
        let decoder = new TextDecoder(encoding);
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                buffer += decoder.decode(new ArrayBuffer(0), { stream: false });
                break;
            }
            buffer += decoder.decode(value, { stream: true });
        }
        return this.parseSync(buffer);
    }
    parseAll(scanner) {
        const dxf = {
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
        while (!(0, shared_1.isMatched)(curr, 0, 'EOF')) {
            if ((0, shared_1.isMatched)(curr, 0, 'SECTION')) {
                curr = scanner.next();
                if ((0, shared_1.isMatched)(curr, 2, 'HEADER')) {
                    curr = scanner.next();
                    dxf.header = (0, header_1.parseHeader)(curr, scanner);
                }
                else if ((0, shared_1.isMatched)(curr, 2, 'BLOCKS')) {
                    curr = scanner.next();
                    dxf.blocks = (0, blocks_1.parseBlocks)(curr, scanner);
                }
                else if ((0, shared_1.isMatched)(curr, 2, 'ENTITIES')) {
                    curr = scanner.next();
                    dxf.entities = (0, entities_1.parseEntities)(curr, scanner);
                }
                else if ((0, shared_1.isMatched)(curr, 2, 'TABLES')) {
                    curr = scanner.next();
                    dxf.tables = (0, tables_1.parseTables)(curr, scanner);
                }
                else if ((0, shared_1.isMatched)(curr, 2, 'OBJECTS')) {
                    curr = scanner.next();
                    dxf.objects = (0, objects_1.parseObjects)(curr, scanner);
                }
            }
            curr = scanner.next();
        }
        return (0, filterDummyBlocks_1.filterDummyBlocks)(dxf);
    }
}
exports.default = DxfParser;
//# sourceMappingURL=DxfParser.js.map