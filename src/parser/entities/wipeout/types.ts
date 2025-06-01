import type { CommonDxfEntity } from '../shared';
import type { Point3D } from '../../../types';

export interface WipeoutEntity extends CommonDxfEntity {
  type: 'WIPEOUT';
  subclassMarker: 'AcDbWipeout';
  displayOptions: number; // Group code 70
  imageSize: { x: number; y: number }; // Group codes 11, 21
  imagePosition: Point3D; // Group codes 10, 20, 30
}
