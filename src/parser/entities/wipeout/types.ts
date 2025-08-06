import type { Point2D, Point3D } from '../../../types';
import type { ImageClippingBoundaryType } from '../image';
import type { CommonDxfEntity } from '../shared';

export interface WipeoutEntity extends CommonDxfEntity {
    type: 'WIPEOUT';
    subclassMarker: 'AcDbRasterImage';
    classVersion: number;
    /** Insertion point */
    position: Point3D;
    /** U-vector of a single pixel (points along the visual bottom of the image, starting at the insertion point) (in WCS)*/
    uDirection: Point3D
    /** V-vector of a single pixel (points along the visual left side of the image, starting at the insertion point) (in WCS) */
    vDirection: Point3D
    /** Image size in pixels (U and V values) */
    imageSize: Point2D
    /** Hard reference to imagedef object */
    imageDefHardId: string;
    /** @see ImageDisplayFlag */
    displayFlag: number
    /** Image display properties */
    displayProperties: number;
    /** Clipping state (on/off) */
    isClipping: boolean;
    /** Brightness value (0-100; default = 50) */
    brightness: number;
    /** Contrast value (0-100; default = 50) */
    contrast: number;
    /** Fade value (0-100; default = 0) */
    fade: number;
    /** Hard reference to imagedef_reactor object */
    imageDefReactorHardId: string
    /** @see ImageClippingBoundaryType */
    boundaryType: ImageClippingBoundaryType
    /** Number of clip boundary vertices that follow */
    numberOfVertices: number;
    boundary: Point2D[]
}