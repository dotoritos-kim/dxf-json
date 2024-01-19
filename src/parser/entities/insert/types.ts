import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface InsertEntity extends CommonDxfEntity {
    type: 'INSERT';
    subclassMarker: 'AcDbBlockReference';
    isVariableAttributes?: boolean;
    name: string;
    insertionPoint: Point3D;
    xScale: number;
    yScale: number;
    zScale: number;
    rotation: number; // degree
    columnCount: number;
    rowCount: number;
    columnSpacing: number;
    rowSpacing: number;
    extrusionDirection: Point3D;
}
