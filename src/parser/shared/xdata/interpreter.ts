import type { XData, XDataEntry } from './types';

export type XDataInterpreterSnippet<Name extends string> = {
    code: number;
    name: Name;
};

type PackPairType<Snippets> = Snippets extends readonly [infer X, ...infer R]
    ? X extends XDataInterpreterSnippet<infer N>
    ? { [key in N]?: any } & PackPairType<R>
    : PackPairType<R>
    : {};

/**
 * xdata가 code-value의 연속인 경우에 사용 가능
 * ex) DSTYLE
 */
export function createXDataControlInterpreter<
    T extends readonly XDataInterpreterSnippet<string>[],
    >(snippets: T) {
    return (entries: XDataEntry[]): PackPairType<T> => {
        const result = {} as PackPairType<T>;

        for (let i = 0; i < entries.length; i += 2) {
            const snippet = snippets.find(
                ({ code }) => code === entries[i].value,
            );

            if (!snippet) continue;
            // @ts-ignore
            result[snippet.name] = entries[i + 1]?.value;
        }

        return result;
    };
}

interface CreateXDataCatcherParams {
    appName?: string;
    catcher(entry: XDataEntry): boolean;
    escaper?(entry: XDataEntry, count: number): boolean; // 몇 번째인지. 1부터 셈.
}

export function createXDataCatcher({
    appName = 'ACAD',
    catcher,
    escaper,
}: CreateXDataCatcherParams) {
    return function* (xdata?: XData) {
        if (xdata?.appName !== appName) return;

        let isCatchable = false;
        let startIndex = -1;
        for (const [index, entry] of xdata.value.entries()) {
            if (isCatchable) {
                yield entry;

                if (escaper?.(entry, index - startIndex)) return;
            } else if (catcher(entry)) {
                isCatchable = true;
                startIndex = index;
            }
        }
    };
}
