import DxfArrayScanner, { parseGroupValue } from "./DxfArrayScanner";
import fs from "fs";
import { parseHeader } from "./header";
import { parseTables } from "./tables";
import { parseBlocks } from "./blocks";
import { parseEntities } from "./entities";
import { parseObjects } from "./objects";
import { isMatched } from "./shared";
import { filterDummyBlocks } from "./filterDummyBlocks";
import type { ParsedDxf } from "./types";
import { Readable } from "readable-stream";

type ErrorOptions =
	| {
			cause: Error;
	  }
	| undefined;

/** Options for {@link DxfParser} construction. */
export class DxfParserOptions {
	/** Encoding label.
	 * See https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API/Encodings
	 */
	encoding: string = "utf-8";
	/** Throw `TypeError` when encountering invalid encoded data when true. When false, the decoder
	 * will substitute malformed data with a replacement character.
	 */
	encodingFailureFatal: boolean = false;
	debug: boolean = true;
}

export default class DxfParser extends EventTarget {
	private readonly _decoder: TextDecoder;
	private debug: boolean = true;
	constructor(options: DxfParserOptions = new DxfParserOptions()) {
		super();
		this._decoder = new TextDecoder(options.encoding, {
			fatal: options.encodingFailureFatal,
		});
		this.debug = options.debug;
	}
	parseSync(dxfString: string) {
		const dxfLinesArray = dxfString.split(/\r\n|\r|\n/g);
		const scanner = new DxfArrayScanner(dxfLinesArray, this.debug);
		if (!scanner.hasNext()) {
			throw Error("Empty file");
		}

		return this.parseAll(scanner);
	}
	parseStream(stream: Readable | fs.ReadStream) {
		let dxfString = "";
		const self = this;
		return new Promise<ParsedDxf>((res, rej) => {
			stream.on("data", (chunk) => {
				dxfString += chunk;
			});
			stream.on("end", () => {
				try {
					const dxfLinesArray = dxfString.split(/\r\n|\r|\n/g);
					const scanner = new DxfArrayScanner(
						dxfLinesArray,
						this.debug
					);
					if (!scanner.hasNext()) {
						throw Error("Empty file");
					}
					res(self.parseAll(scanner));
				} catch (err) {
					rej(err);
				}
			});
			stream.on("error", (err) => {
				rej(err);
			});
		});
	}

	async parseFromUrl(url: string, init?: RequestInit | undefined) {
		const response = await fetch(url, init);

		if (!response.body) return null;

		const reader = response.body.getReader();
		let buffer = "";

		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				buffer += this._decoder.decode(new ArrayBuffer(0), {
					stream: false,
				});
				break;
			}
			buffer += this._decoder.decode(value, { stream: true });
		}
		return this.parseSync(buffer);
	}

	private parseAll(scanner: DxfArrayScanner) {
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

		while (!isMatched(curr, 0, "EOF")) {
			if (isMatched(curr, 0, "SECTION")) {
				curr = scanner.next();

				if (isMatched(curr, 2, "HEADER")) {
					curr = scanner.next();
					dxf.header = parseHeader(curr, scanner);
				} else if (isMatched(curr, 2, "BLOCKS")) {
					curr = scanner.next();
					dxf.blocks = parseBlocks(curr, scanner);
				} else if (isMatched(curr, 2, "ENTITIES")) {
					curr = scanner.next();
					dxf.entities = parseEntities(curr, scanner);
				} else if (isMatched(curr, 2, "TABLES")) {
					curr = scanner.next();
					dxf.tables = parseTables(curr, scanner);
				} else if (isMatched(curr, 2, "OBJECTS")) {
					curr = scanner.next();
					dxf.objects = parseObjects(curr, scanner);
				}
			}
			curr = scanner.next();
		}
		return filterDummyBlocks(dxf);
	}
}
