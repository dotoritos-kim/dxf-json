import { CommonDxfEntity } from '../shared';
import type {
    DefaultLightingType,
    OrthographicType,
    RenderMode,
    ShadePlotMode,
    UCSPerViewport,
} from '../../../consts';
import type { Point2D, Point3D } from '../../../types';

export interface ViewportEntity extends CommonDxfEntity {
    type: 'VIEWPORT';
    subclassMarker: string;
    viewportCenter: Point3D; // WCS
    width: number; // paper space unit
    height: number; // paper space unit
    status: number; // -1: ON but off scren, 0: OFF, positive: ON and active
    viewportId: number;
    displayCenter: Point2D; // DCS, viewportCenter가 화면 상 displayCenter에 와야된다는 뜻
    snapBase: Point2D;
    snapSpacing: Point2D;
    gridSpacing: Point2D;
    viewDirection: Point3D; // WCS
    targetPoint: Point3D; // WCS
    perspectiveLensLength: number;
    frontClipZ: number;
    backClipZ: number;
    viewHeight: number; // model space unit
    snapAngle: number;
    viewTwistAngle: number;
    circleZoomPercent: number;
    frozenLayerIds?: string[];
    statusBitFlags: number;
    clippingBoundaryId?: string; // viewport가 직사각형 아닌 경우 경계선을 정의하는 entity id
    sheetName: string;
    renderMode: RenderMode;
    ucsPerViewport: UCSPerViewport;
    ucsOrigin?: Point3D;
    ucsXAxis?: Point3D;
    ucsYAxis?: Point3D;
    ucsId?: string; // ID/handle of AcDbUCSTableRecord if UCS is a named UCS. If not present, then UCS is unnamed
    ucsBaseId?: string; // ID/handle of AcDbUCSTableRecord of base UCS if UCS is orthographic. If it's not exists, taken to be WORLD
    orthographicType?: OrthographicType;
    elevation: number;
    shadePlotMode: ShadePlotMode;
    majorGridFrequency: number; // Frequency of major grid lines compared to minor grid lines
    backgroundId?: string;
    shadePlotId?: string;
    visualStyleId?: string;
    isDefaultLighting: boolean;
    defaultLightingType?: DefaultLightingType;
    brightness: number;
    contrast: number;
    ambientLightColor?: string;
    sunId?: string;
    softPointer?: string;
}
