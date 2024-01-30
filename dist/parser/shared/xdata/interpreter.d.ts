import type { XData, XDataEntry } from './types';
export type XDataInterpreterSnippet<Name extends string> = {
    code: number;
    name: Name;
};
type PackPairType<Snippets> = Snippets extends readonly [infer X, ...infer R] ? X extends XDataInterpreterSnippet<infer N> ? {
    [key in N]?: any;
} & PackPairType<R> : PackPairType<R> : {};
/**
 * xdata가 code-value의 연속인 경우에 사용 가능
 * ex) DSTYLE
 */
export declare function createXDataControlInterpreter<T extends readonly XDataInterpreterSnippet<string>[]>(snippets: T): (entries: XDataEntry[]) => PackPairType<T>;
interface CreateXDataCatcherParams {
    appName?: string;
    catcher(entry: XDataEntry): boolean;
    escaper?(entry: XDataEntry, count: number): boolean;
}
export declare function createXDataCatcher({ appName, catcher, escaper, }: CreateXDataCatcherParams): (xdata?: XData) => Generator<XDataEntry, void, unknown>;
export {};
