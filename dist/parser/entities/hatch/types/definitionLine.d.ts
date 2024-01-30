import { Point2D } from '../../../../types';
export interface HatchDefinitionLine {
    angle: number;
    base: Point2D;
    offset: Point2D;
    numberOfDashLengths: number;
    dashLengths: number[];
}
