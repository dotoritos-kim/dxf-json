import {
    DefaultLightingType,
    OrthographicType,
    RenderMode,
    ShadePlotMode,
    UCSPerViewport,
} from '../../../consts';
import type { Vector2, Vector3 } from 'three';

export interface ViewportEntity {
    type: 'VIEWPORT';
    subclassMarker: string;
    handle?: string;
    layer?: string;
    viewportCenter: Vector3; // WCS
    width: number; // paper space unit
    height: number; // paper space unit
    status: number; // -1: ON but off scren, 0: OFF, positive: ON and active
    viewportId: string;
    displayCenter: Vector2; // DCS, viewportCenter가 화면 상 displayCenter에 와야된다는 뜻
    snapBase: Vector2;
    snapSpacing: Vector2;
    gridSpacing: Vector2;
    viewDirection: Vector3; // WCS
    targetPoint: Vector3; // WCS
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
    ucsOrigin?: Vector3;
    ucsXAxis?: Vector3;
    ucsYAxis?: Vector3;
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
