import { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export enum ImageFlags {
    ShowImage = 1,
    ShowImageWhenNotAlignedWithScreen = 2,
    UseClippingBoundary = 4,
    TransparencyIsOn = 8,
}

export enum ImageClippingBoundaryType {
    Rectangular = 1,
    Polygonal = 2,
}

export enum ImageClipMode {
    Outside = 0,
    Inside = 1,
}

export interface ImageEntity extends CommonDxfEntity {
    type: 'IMAGE';
    subclassMarker: 'AcDbRasterImage';
    version: number;
    position: Point3D;
    uPixel: Point3D;
    vPixel: Point3D;
    imageSize: Point3D;
    imageDefHandle: string;
    flags: ImageFlags;
    clipping: number;
    brightness: number;
    contrast: number;
    fade: number;
    imageDefReactorHandle: string;
    clippingBoundaryType: ImageClippingBoundaryType;
    countBoundaryPoints: number;
    clippingBoundaryPath: Point3D[];
    clipMode: ImageClipMode;
}
