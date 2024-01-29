"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UndirectedMultiGraph = void 0;
/**
 * 정수로 표현하는 무향 비단순 그래프
 * 두 정점 사이에 간선이 여러 개 존재할 수 있음
 * 인접 리스트를 사용
 * 간선에 값을 할당할 수 있음
 */
class UndirectedMultiGraph {
    constructor() {
        this.vertices = new Set();
        this.edges = [];
    }
    addEdge(u, v, value) {
        this.vertices.add(u);
        this.vertices.add(v);
        this.connectDirected(u, v, value);
        this.connectDirected(v, u, value);
    }
    getDegree(v) {
        return this.edges[v].reduce((acc, neighbor) => neighbor.values.length + acc, 0);
    }
    getEdgeCount(u, v) {
        var _a, _b, _c;
        return ((_c = (_b = (_a = this.edges[u]) === null || _a === void 0 ? void 0 : _a.find(({ index }) => index === v)) === null || _b === void 0 ? void 0 : _b.values.length) !== null && _c !== void 0 ? _c : 0);
    }
    *getNeighbors(u) {
        var _a;
        if ((_a = this.edges[u]) === null || _a === void 0 ? void 0 : _a.length) {
            yield* this.edges[u][Symbol.iterator]();
        }
    }
    connectDirected(u, v, value) {
        var _a;
        var _b;
        (_a = (_b = this.edges)[u]) !== null && _a !== void 0 ? _a : (_b[u] = []);
        let neighbor = this.edges[u].find(({ index }) => index === v);
        if (!neighbor) {
            neighbor = { index: v, values: [] };
            this.edges[u].push(neighbor);
        }
        neighbor.values.push(value);
    }
}
exports.UndirectedMultiGraph = UndirectedMultiGraph;
//# sourceMappingURL=graph.js.map