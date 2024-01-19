import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';
import { TextHorizontalAlign, TextVerticalAlign } from './consts';

export interface TextEntity extends CommonDxfEntity {
    type: 'TEXT';
    subclassMarker: 'AcDbText';
    text: string;
    thickness: number;
    startPoint: Point3D;
    endPoint: Point3D;
    textHeight: number;
    rotation: number; // degree
    xScale: number;
    obliqueAngle: number;
    styleName: string;
    generationFlag: number;
    halign: TextHorizontalAlign;
    valign: TextVerticalAlign;
    extrusionDirection: Point3D;
}
