import { AttachmentPoint, DimensionTextLineSpacing, DimensionType } from '../../../consts';
import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';
export interface DimensionEntityCommon extends CommonDxfEntity {
    type: 'DIMENSION';
    subclassMarker: string;
    handle: string;
    version: string;
    name: string;
    definitionPoint: Point3D;
    textPoint: Point3D;
    dimensionType: DimensionType;
    attachmentPoint: AttachmentPoint;
    textLineSpacingStyle?: DimensionTextLineSpacing;
    textLineSpacingFactor?: number;
    measurement?: number;
    text?: string;
    textRotation?: number;
    ocsRotation?: number;
    extrusionDirection?: Point3D;
    styleName: string;
}
export interface AlignedDimensionEntity extends DimensionEntityCommon {
    subclassMarker: 'AcDbAlignedDimension' | 'AcDbRotatedDimension';
    insertionPoint?: Point3D;
    subDefinitionPoint1: Point3D;
    subDefinitionPoint2: Point3D;
    rotationAngle: number;
    obliqueAngle: number;
}
export interface AngularDimensionEntity extends DimensionEntityCommon {
    subclassMarker: 'AcDb3PointAngularDimension';
    subDefinitionPoint1: Point3D;
    subDefinitionPoint2: Point3D;
    centerPoint: Point3D;
    arcPoint: Point3D;
}
export interface OrdinateDimensionEntity extends DimensionEntityCommon {
    subclassMarker: 'AcDbOrdinateDimension';
    subDefinitionPoint1: Point3D;
    subDefinitionPoint2: Point3D;
}
export interface RadialDiameterDimensionEntity extends DimensionEntityCommon {
    subclassMarker: 'AcDbRadialDimension' | 'AcDbDiametricDimension';
    centerPoint: Point3D;
    leaderLength: number;
}
export type DimensionEntity = DimensionEntityCommon & (Partial<AlignedDimensionEntity> | Partial<AngularDimensionEntity> | Partial<OrdinateDimensionEntity> | Partial<RadialDiameterDimensionEntity>);
