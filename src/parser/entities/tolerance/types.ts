import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface ToleranceEntity extends CommonDxfEntity {
    type: 'TOLERANCE';
    subclassMarker: 'AcDbFcf';
    /** Dimension style name */
    styleName: string;
    /** Insertion point */
    position: Point3D;
    /** String representing the visual representation of the tolerance */
    text: string;
    /** Extrusion direction (optional) */
    extrusionDirection?: Point3D;
    /** X-axis direction vector (in WCS) */
    xAxisDirection: Point3D;
}