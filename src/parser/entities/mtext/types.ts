import type { AttachmentPoint } from '../../../consts';
import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';
import type { MTextDrawingDirection } from './consts';

export interface MTextEntity extends CommonDxfEntity {
    type: 'MTEXT';
    subclassMarker: 'AcDbMText';
    insertionPoint: Point3D;
    height: number;
    width: number;
    attachmentPoint: AttachmentPoint;
    drawingDirection: MTextDrawingDirection;
    text: string[];
    styleName: string;
    extrusionDirection: Point3D;
    direction: Point3D;
    rotation: number; // radian
    lineSpacingStyle: number;
    lineSpacing: number;
    backgroundFill: number;
    backgroundColor: number;
    fillBoxScale: number;
    backgroundFillColor: number;
    backgroundFillTransparency: number;
    columnType: number;
    columnCount: number;
    columnFlowReversed: number;
    columnAutoHeight: number;
    columnWidth: number;
    columnGutter: number;
    columnHeight: number;
    annotationHeight: number;
}
