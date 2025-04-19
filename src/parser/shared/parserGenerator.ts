import { isMatched } from './isMatched';
import type DxfArrayScanner from '../DxfArrayScanner';
import { ScannerGroup } from '../DxfArrayScanner';
import { parsePoint } from './parsePoint';

export const Abort = Symbol();

// Snippet은 스트림에서 code를 읽었을 때 적절한 원자 파서를
// 대응해 주는 역할을 한다.
// Snippet은 스택에 쌓이며, 여러 Snippet이 동일한 code를
// 소비할 수 있을 때, 가장 위에 쌓인 Snippet이 우선순위를 갖는다.
export interface DXFParserSnippet {
    code: number | number[]; // 복수의 코드를 다 한 곳으로 몰아넣기
    name?: string; // 파싱한 값을 넣을 오브젝트 속성 명, 없으면 등록 안하고 패스함

    // 추가로 더 읽어야 할 때만 scanner 사용하고, 새 값은 읽어놓지 말 것
    // 반환되는 값이 entity[name]에 대입되므로 특별한 경우엔 entity 건들지 말고
    // 사용할 경우, 최종값이 반환되도록 잘 건드릴 것
    // 만약 Abort 심볼이 반환될 경우 값에 대입하지 않고 읽은 것을 한 칸 되돌리고
    // 종료함
    parser?(curr: ScannerGroup, scanner: DxfArrayScanner, entity: any): any;
    isMultiple?: boolean; // code가 여러 번 들어올 수 있는 경우, true로 표기

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
    target: any,
) => boolean;

export function createParser(
    snippets: DXFParserSnippet[],
    defaultObject?: any,
): DXFParser {
    return (curr, scanner, target) => {
        const snippetMaps = createSnippetMaps(snippets);
        let isReadOnce = false;
        let contextIndex = snippetMaps.length - 1;

        while (!isMatched(curr, 0, 'EOF')) {
            const snippetMap = findSnippetMap(
                snippetMaps,
                curr.code,
                contextIndex,
            );
            const snippet = snippetMap?.[curr.code].at(-1);

            if (!snippetMap || !snippet) {
                scanner.rewind();
                break;
            }

            if (!snippet.isMultiple) {
                snippetMap[curr.code].pop();
            }

            const { name, parser, isMultiple } = snippet;
            const parsedValue = parser?.(curr, scanner, target);

            if (parsedValue === Abort) {
                scanner.rewind();
                break;
            }

            if (name) {
                const [leaf, fieldName] = getObjectByPath(target, name);

                if (isMultiple) {
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

function createSnippetMaps(snippets: DXFParserSnippet[]) {
    return snippets.reduce(
        (acc, snippet) => {
            if (snippet.pushContext) {
                acc.push({});
            }

            const context = acc[acc.length - 1];
            const codes =
                typeof snippet.code === 'number'
                    ? [snippet.code]
                    : snippet.code;

            for (const code of codes) {
                const bin = (context[code] ??= []);

                if (snippet.isMultiple && bin.length) {
                    console.warn(
                        `Snippet ${bin.at(-1)!.name
                        } for code(${code}) is shadowed by ${snippet.name}`,
                    );
                }
                bin.push(snippet);
            }

            return acc;
        },
        [{}] as Record<number, DXFParserSnippet[]>[],
    );
}

function findSnippetMap(
    snippetMaps: Record<number, DXFParserSnippet[]>[],
    code: number,
    contextIndex: number,
) {
    return snippetMaps.find(
        (map, index) => index >= contextIndex && map[code]?.length,
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
 */
function getObjectByPath(target: any, path: string) {
    const fragments = path.split('.');

    let currentTarget = target;
    for (let depth = 0; depth < fragments.length - 1; ++depth) {
        const currentName = fragments[depth];
        if (!Object.prototype.hasOwnProperty.call(currentTarget, currentName)) {
            currentTarget[currentName] = {};
        }
        currentTarget = currentTarget[currentName];
    }
    return [currentTarget, fragments.at(-1)!];
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
