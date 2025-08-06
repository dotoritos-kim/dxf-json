
import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner';
import { isMatched } from './isMatched';
import { parsePoint } from './parsePoint';


export const Abort = Symbol();

// Snippet은 스트림에서 code를 읽었을 때 적절한 원자 파서를
// 대응해 주는 역할을 한다.
// Snippet은 스택에 쌓이며, 여러 Snippet이 동일한 code를
// 소비할 수 있을 때, 가장 위에 쌓인 Snippet이 우선순위를 갖는다.
export interface DXFParserSnippet {
    code: number | number[]; // 복수의 코드를 다 한 곳으로 몰아넣기
    name?: string; // 파싱한 값을 넣을 오브젝트 속성 명, 없으면 등록 안하고 패스함

    /**
     * Define how to parse starting from given current group.
     * If it's not defined, current group will be ignored.
     * 
     * Note that `parser` must consume their own domain's groups only.
     * If parser read group code which is not their domain,
     * you must call `scanner.rewind()` to reposition the scanner.
     * 
     * @param curr current scanner group
     * @param scanner current scanner object
     * @param entity target object where parsed value be written. 
     *               you may mutate this object for complex situation, 
     *               but you must return assigining value.
     * @return parsed value or `Abort` symbol.
     *         If returned value is not `Abort`, it will be assigned to `entity[name]`
     *         If returned value is `Abort`, caller will rewind the scanner by one group.
     *         It's very rare to return `Abort`.
     */
    parser?(curr: ScannerGroup, scanner: DxfArrayScanner, entity: any): any;
    /** When specific group code can be read multiple times, set this `true` */
    isMultiple?: boolean;
    /** When isMultiple is `true`, save array when `false`, replace as is when `true` */
    isReducible?: boolean; 

    // https://github.com/connect-for-you/cadview-front/issues/41
    // 이 스니펫을 기점으로 맥락을 바꿈
    pushContext?: boolean;

}

// 만약 파서가 어떤 유의미한 snippet도 찾지 못한 경우 전진하지 말고 false 반환
// 만약 파서가 유의미한 snippet을 찾아서 사용한 경우 반드시 한 칸 전진시키고 true 반환
// 즉 새로운 애를 하나는 무조건 읽어놓음
export type DXFParser = (
	curr: ScannerGroup,
	scanner: DxfArrayScanner,
	target: any
) => boolean;

export function createParser(
	snippets: DXFParserSnippet[],
	defaultObject?: any
): DXFParser {
    return (curr, scanner, target) => {
        const snippetMaps = createSnippetMaps(snippets, scanner.debug);
        let isReadOnce = false;
        let contextIndex = snippetMaps.length - 1;

        while (!isMatched(curr, 0, 'EOF')) {
            const snippetMap = findSnippetMap(
                snippetMaps,
                curr.code,
                contextIndex,
            );
            const snippetsForCode = snippetMap?.[curr.code]
            const snippet = snippetsForCode?.[snippetsForCode.length - 1]

            if (!snippetMap || !snippet) {
                scanner.rewind();
                break;
            }

            if (!snippet.isMultiple) {
                snippetMap[curr.code].pop();
            }

            const { name, parser, isMultiple, isReducible } = snippet;
            const parsedValue = parser?.(curr, scanner, target);

            if (parsedValue === Abort) {
                scanner.rewind();
                break;
            }

            if (name) {
                const [leaf, fieldName] = getObjectByPath(target, name);

                if (isMultiple && !isReducible) {
                    // default value is injected via prototype, therefore have to check their own properties
                    if (!Object.prototype.hasOwnProperty.call(leaf, fieldName)) {
                        leaf[fieldName] = [];
                    }
                    leaf[fieldName].push(parsedValue);
                } else {
                    leaf[fieldName] = parsedValue;
                }
            }

            if (snippet.pushContext) {
                contextIndex -= 1;
            }

            isReadOnce = true;
            curr = scanner.next();
        }

        if (defaultObject) {
            Object.setPrototypeOf(target, defaultObject);
        }

        return isReadOnce;
    };
}

function createSnippetMaps(snippets: DXFParserSnippet[], isDebugMode = false) {
	return snippets.reduce(
		(acc, snippet) => {
			if (snippet.pushContext) {
				acc.push({});
			}

			const context = acc[acc.length - 1];
			const codes =
				typeof snippet.code === "number"
					? [snippet.code]
					: snippet.code;

			for (const code of codes) {
				const bin = (context[code] ??= []);

				if (snippet.isMultiple && bin.length && isDebugMode) {
                    console.warn(
                        `Snippet ${
                            bin[bin.length - 1].name
                        } for code(${code}) is shadowed by ${snippet.name}`
                    );
				}
				bin.push(snippet);
			}

			return acc;
		},
		[{}] as Record<number, DXFParserSnippet[]>[]
	);
}

function findSnippetMap(
	snippetMaps: Record<number, DXFParserSnippet[]>[],
	code: number,
	contextIndex: number
) {
	return snippetMaps.find(
		(map, index) => index >= contextIndex && map[code]?.length
	);
}

/**
 * path를 .으로 나누고, 그 서브패스의 값을 설정할 수 있게 함.
 * 값이 없으면 알아서 만듦
 *
 * ex) a.b -> target[a]를 반환하여 b를 대입할 수 있게 함
 *     a.b.c -> target[a][b]를 반환하여 c를 대입할 수 있게 함
 *
 * @param target .으로 구분된 경로
 * @param path
 * @return [finalTargetObject, name]
 * @internal
 */
export function getObjectByPath(target: any, path: string): [any, string | number] {
    const fragments = path.split('.');

    if (!fragments.length) {
        throw new Error('[parserGenerator::getObjectByPath] Invalid empty path')
    }

    let parent = target;
    for (let depth = 0; depth < fragments.length - 1; ++depth) {
        const currentName = refineName(fragments[depth]);
        const nextName = refineName(fragments[depth + 1]);

        if (!Object.prototype.hasOwnProperty.call(parent, currentName)) {
            if (typeof nextName === 'number') {
                parent[currentName] = [];
            } else {
                parent[currentName] = {};
            }
        }
        parent = parent[currentName];
    }
    return [parent, refineName(fragments[fragments.length - 1])];
}

function refineName(name: string): string | number {
    const num = Number.parseInt(name)
    if (Number.isNaN(num)) return name
    return num
}

export function Identity({ value }: ScannerGroup) {
	return value;
}

export function PointParser(_: any, scanner: DxfArrayScanner) {
	return parsePoint(scanner);
}

export function ToBoolean({ value }: ScannerGroup) {
	return !!value;
}

export function Trim({ value }: ScannerGroup): string {
    return value.trim();
}