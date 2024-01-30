import type { Point3D } from '../../../types';
export interface XData {
    appName: string;
    value: XDataEntry[];
}
export interface XDataEntry {
    name?: string;
    value: XDataEntry[] | number | string | Point3D;
}
