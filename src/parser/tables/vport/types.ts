import type {
    RenderMode,
    OrthographicType,
    DefaultLightingType,
} from '../../../consts';
import type { Point2D, Point3D } from '../../../types';
import type { CommonDxfTableEntry } from '../types';

export interface VPortTableEntry extends CommonDxfTableEntry {
    subclassMarker: 'AcDbViewportTableRecord';
    name: string;
    standardFlag: number;
    lowerLeftCorner: Point2D;
    upperRightCorner: Point2D;
    center: Point2D;
    snapBasePoint: Point2D;
    snapSpacing: Point2D;
    gridSpacing: Point2D;
    viewDirectionFromTarget: Point3D;
    viewTarget: Point3D;
    lensLength: number;
    frontClippingPlane: number;
    backClippingPlane: number;
    viewHeight: number;
    snapRotationAngle: number;
    viewTwistAngle: number;
    circleSides: number;
    frozenLayers: string[];
    styleSheet: string;
    renderMode: RenderMode;
    viewMode: number;
    ucsIconSetting: number;
    ucsOrigin: Point3D;
    ucsXAxis: Point3D;
    ucsYAxis: Point3D;
    orthographicType: OrthographicType;
    elevation: number;
    shadePlotSetting: number;
    majorGridLines: number;
    backgroundObjectId?: string;
    shadePlotObjectId?: string;
    visualStyleObjectId?: string;
    isDefaultLightingOn: boolean;
    defaultLightingType: DefaultLightingType;
    brightness: number;
    contrast: number;
    ambientColor?: number;
}
