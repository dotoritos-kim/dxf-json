export interface Edge<E> {
    index: number;
    values: E[];
}
/**
 * 정수로 표현하는 무향 비단순 그래프
 * 두 정점 사이에 간선이 여러 개 존재할 수 있음
 * 인접 리스트를 사용
 * 간선에 값을 할당할 수 있음
 */
export declare class UndirectedMultiGraph<T> {
    vertices: Set<number>;
    edges: Edge<T>[][];
    addEdge(u: number, v: number, value: T): void;
    getDegree(v: number): number;
    getEdgeCount(u: number, v: number): number;
    getNeighbors(u: number): Generator<Edge<T>, void, undefined>;
    private connectDirected;
}
