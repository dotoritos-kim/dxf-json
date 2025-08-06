import type { Point2D } from "../../../../types";

/*
 * offset이란 선과 선 사이의 간격을 만드는 벡터이다.
 * 그런데 이게 무조건 y축과 평행하다는 보장은 없다.
 * (angle과도 무관하다)
 */
export interface HatchDefinitionLine {
    angle: number; // degree
    base: Point2D;
    offset: Point2D;
    numberOfDashLengths: number;
    dashLengths: number[];
}
