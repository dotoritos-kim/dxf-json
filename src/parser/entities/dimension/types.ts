import type {
    AttachmentPoint,
    DimensionTextLineSpacing,
} from '../../../consts';
import type { Point3D } from '../../../types';
import type { DimStyleVariables } from '../../tables/dimStyle/types';
import type { CommonDxfEntity } from '../shared';

/**
 * Base type of *DIMENSION* entities.
 * 
 * @note In AutoCAD 2025, *DIMENSION* can have DIMSTYLE override not only in `xdata`
 * but directly at the object itself. In this case, object may have DimStyle fields.
 * @see DimStyleVariables
 */
export interface DimensionEntityCommon extends CommonDxfEntity, Partial<DimStyleVariables> {
    type: 'DIMENSION';
    /** 
     * Actually there are more than one subclass in one entity
     * but because of historical reasons, very last subclass marker will be set
     * */
    subclassMarker: string;
    /** Version number. Actually there is only one valid value `0` which means 2010 */
    version: number;
    /** Name of the block that contains the entities that make up the dimension picture */
    name: string;
    /** Point defined by group code `(10, 20, 30)`. */
    definitionPoint: Point3D;
    /** Middle point of dimension text (in OCS) */
    textPoint: Point3D;
    /**
     * Dimension type:
     * 
     * Values `0` ~ `6` are integer values that represent the dimension type.
     * 
     * Values `32`, `64`, and `128` are bit values, which are added to the integer values 
     * (value `32` is always set in R13 and later releases)
     * 
     * @see DimensionType 
     * */
    dimensionType: number;
    attachmentPoint: AttachmentPoint;
    textLineSpacingStyle?: DimensionTextLineSpacing;
    textLineSpacingFactor?: number;
    /** 
     * Actual measurement
     * 
     * @note This value is often missing or set to `0` in actual files, 
     * so don't believe this too much. 
     * */
    measurement?: number;
    /** 	
     * Dimension text explicitly entered by the user. 
     * 
     * - If `null` or `"<>"`, the dimension measurement is drawn as the text.
     * - If `""`, the text is suppressed. 
     * - Anything else is drawn as the text.
     * */
    text?: string;
    /** 
     * The rotation angle of the dimension text away from 
     * its default orientation (the direction of the dimension line) 
     * */
    textRotation?: number;
    /**
     * Indicates the horizontal direction for the dimension entity. 
     * 
     * The dimension entity determines the orientation of dimension text 
     * and lines for horizontal, vertical, and rotated linear dimensions.
     * 
     * This group value is the negative of the angle between the OCS X axis 
     * and the UCS X axis. 
     * 
     * It is always in the XY plane of the OCS.
     */
    ocsRotation?: number;
    extrusionDirection?: Point3D;
    /** Dimension style name */
    styleName: string;
}

/**
 * Type for linear and aligned dimension.
 * 
 * @note In AutoCAD 2025, *DIMENSION* can have DIMSTYLE override not only in `xdata`
 * but directly at the object itself. In this case, object may have DimStyle fields.
 */
export interface AlignedDimensionEntity extends DimensionEntityCommon {
    /**
     * Be aware of the naming: `AcDbAlignedDimension` is represented as "linear dimension"
     * in AutoCAD, while `AcDbRotatedDimension` is represented as "aligned dimension".
     * 
     * This is so confusing, but as we're following DXF spec, we used the one in data as is.
     */
    subclassMarker: 'AcDbAlignedDimension' | 'AcDbRotatedDimension';
    /** Insertion point for clones of a dimension—Baseline and Continue (in OCS) */
    insertionPoint?: Point3D;
    /** 
     * Point defined by group code `(13, 23, 33)`. This specifies the start point of 
     * the **first extension line**.
     * */
    subDefinitionPoint1: Point3D;
    /**
     * Point defined by group code `(14, 24, 34)`. This specifies the start point of
     * the **second extension line**.
     */
    subDefinitionPoint2: Point3D;
    /** Angle of rotated, horizontal, or vertical dimensions */
    rotationAngle?: number;
    /** 	
     * Linear dimension types with an oblique angle have an optional group code `52`. 
     * When added to the rotation angle of the linear dimension (group code `50`), 
     * it gives the angle of the extension lines */
    obliqueAngle?: number;
}

/**
 * `AngularDimension` is used to describe arc length or degree of angle.
 *
 * This is the most confusing part of *DIMENSION* entity, so read carefuly
 * every comment of each properties before you use it.
 *
 * @note In AutoCAD 2025, *DIMENSION* can have DIMSTYLE override not only in `xdata`
 * but directly at the object itself. In this case, object may have DimStyle fields.
 */
export interface AngularDimensionEntity extends DimensionEntityCommon {
    /**
     * @note subclass marker doesn't related to 3-point or 4-point mode.
     */
    subclassMarker: 'AcDb3PointAngularDimension' | 'AcDb2LineAngularDimension';
    /** 
     * Point defined by group code `(13, 23, 33)`. 
     * This is used to determine the first extension line.
     * */
    subDefinitionPoint1: Point3D;
    /** 
     * Point defined by group code `(14, 24, 34)`.
     * 
     * In 3-point mode, this specifies the start of the second extension line.
     * 
     * In 4-point mode, this specifies the start of the first extension line. 
     * */
    subDefinitionPoint2: Point3D;
    /** 
     * Point defined by group code `(15,25,35)`.
     * 
     * In 3-point mode, this specifies the vertex of the angle in three point mode.
     * 
     * In 4-point mode, this specifies the start of the second extension line. 
     */
    centerPoint: Point3D;
    /** 
     * Point defined by group code `(16, 26, 36)`.
     * 
     * This specifies the location of the dimension line arc.
     * 
     * @note this only exist on 4-point mode. 
     * */
    arcPoint?: Point3D;
}

/**
 * Z shaped dimension. 
 * 
 * Note that `definitionPoint` of `OrdinateDimension` doesn't matter at all, 
 * as the actual points are defined in `subDefinitionPoint1` and `subDefinitionPoint2`. 
 * 
 * @note In AutoCAD 2025, *DIMENSION* can have DIMSTYLE override not only in `xdata`
 * but directly at the object itself. In this case, object may have DimStyle fields.
 */
export interface OrdinateDimensionEntity extends DimensionEntityCommon {
    subclassMarker: 'AcDbOrdinateDimension';
    /** 
     * Point defined by group code `(13, 23, 33)`. 
     * 
     * It specifies the start position of dimension line.
     * */
    subDefinitionPoint1: Point3D;
    /** 
     * Point defined by group code `(14, 24, 34)`. 
     * 
     * It specifies the end position of ordinate dimension.
     * */
    subDefinitionPoint2: Point3D;
}

/**
 * In `AcDbRadialDimension`, `definitionPoint` specifies the center of circle.
 * 
 * In `AcDbDiametricDimension`, `definitionPoint` specifies the one end of diameter line.
 * 
 * @note In AutoCAD 2025, *DIMENSION* can have DIMSTYLE override not only in `xdata`
 * but directly at the object itself. In this case, object may have DimStyle fields.
 */
export interface RadialDiameterDimensionEntity extends DimensionEntityCommon {
    subclassMarker: 'AcDbRadialDimension' | 'AcDbDiametricDimension';
    /** 
     * Point defined by group code `(15, 25, 35)`.  
     * 
     * It specifies the other end of radial/diameter line.
     * */
    subDefinitionPoint: Point3D;
    /** Leader length for radius and diameter dimensions */
    leaderLength: number;
}

/**
 * Combined type of *DIMENSION* entity.
 */
export type DimensionEntity = DimensionEntityCommon &
    (
        | Partial<AlignedDimensionEntity>
        | Partial<AngularDimensionEntity>
        | Partial<OrdinateDimensionEntity>
        | Partial<RadialDiameterDimensionEntity>
    );
