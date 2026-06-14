import type { Point2D } from '../../../types/shared.ts';
import type { CommonDXFObject } from '../types.ts';
import { ImageResolutionUnits } from './consts.ts';

export interface ImageDefDXFObject extends CommonDXFObject {
  subclassMarker: 'AcDbRasterImageDef';
  fileName: string;
  size: Point2D;
  sizeOfOnePixel: Point2D;
  isLoaded: number;
  resolutionUnits: number;
}

export { ImageResolutionUnits };