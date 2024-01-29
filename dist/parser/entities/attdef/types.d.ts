import type { Point3D } from '../../../types';
import type { TextEntity } from '../text';
export interface AttdefEntity extends Omit<TextEntity, 'type' | 'subclassMarker'> {
    type: 'ATTDEF';
    subclassMarker: 'AcDbAttributeDefinition';
    prompt: string;
    tag: string;
    attributeFlag: number;
    isLocked: boolean;
    isDuplicatedRecord: boolean;
    mtextFlag: number;
    isReallyLocked: boolean;
    numberOfSecondaryAttributes: number;
    secondaryAttributesHardIds: string[];
    alignmentPoint: Point3D;
    annotationScale: number;
}
