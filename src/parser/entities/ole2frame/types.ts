import type { CommonDxfEntity } from '../shared';
import type { Point3D } from '../../../types';

export interface Ole2FrameEntity extends CommonDxfEntity {
  type: 'OLE2FRAME';
  subclassMarker: 'AcDbOle2Frame';
  oleVersion: number; // Group code 70
  oleType: number;    // Group code 71
  tileMode: number;   // Group code 72
  binaryDataSize: number; // Group code 90
  upperLeft: Point3D;     // Group codes 10, 20, 30
  lowerRight: Point3D;    // Group codes 11, 21, 31
  binaryData: string[];   // Group code 310 (multiple entries)
  oleClassName: string;   // Group code 3
}