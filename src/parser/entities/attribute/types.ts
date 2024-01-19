import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface AttributeEntity extends CommonDxfEntity {
    type: 'ATTRIB';
    subclassMarker: 'AcDbAttribute';
    thickness: number;
    startPoint: Point3D;
    textHeight: number;
    text: string;
    tag: string; // cannot contain spaces
    attributeFlag: number;
    lineSpacing?: number;
    rotation: number;
    scale: number;
    obliqueAngle: number;
    textStyle: string;
    textGenerationFlag: number;
    horizontalJustification: number;
    verticalJustification: number;
    extrusionDirection: Point3D;
    lockPositionFlag: boolean;
    isDuplicatedEntriesKeep?: boolean;
    mtextFlag: 2 | 4;
    isReallyLocked?: boolean;
    numberOfSecondaryAttributes?: number;
    secondaryAttributesHardId?: string;
    alignmentPoint: Point3D;
    annotationScale?: number;
    definitionTag?: string;
}
