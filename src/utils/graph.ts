// index로 연결하는 복수 개의 간선을 갖는 것들
export interface Edge<E> {
    index: number; // vertex
    values: E[];
}

/**
 * 정수로 표현하는 무향 비단순 그래프
 * 두 정점 사이에 간선이 여러 개 존재할 수 있음
 * 인접 리스트를 사용
 * 간선에 값을 할당할 수 있음
 */
export class UndirectedMultiGraph<T> {
    vertices = new Set<number>();
    edges = [] as Edge<T>[][];

    addEdge(u: number, v: number, value: T) {
        this.vertices.add(u);
        this.vertices.add(v);
        this.connectDirected(u, v, value);
        this.connectDirected(v, u, value);
    }

    getDegree(v: number) {
        return this.edges[v].reduce(
            (acc, neighbor) => neighbor.values.length + acc,
            0,
        );
    }

    getEdgeCount(u: number, v: number) {
        return (
            this.edges[u]?.find(({ index }) => index === v)?.values.length ?? 0
        );
    }

    *getNeighbors(u: number) {
        if (this.edges[u]?.length) {
            yield* this.edges[u][Symbol.iterator]();
        }
    }

    private connectDirected(u: number, v: number, value: T) {
        this.edges[u] ??= [];

        let neighbor = this.edges[u].find(({ index }) => index === v);
        if (!neighbor) {
            neighbor = { index: v, values: [] };
            this.edges[u].push(neighbor);
        }
        neighbor.values.push(value);
    }
}
