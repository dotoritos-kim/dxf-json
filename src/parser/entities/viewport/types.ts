import type { Point2D, Point3D } from '../../../types'
import type {
    DefaultLightingType,
    OrthographicType,
    RenderMode,
    UCSPerViewport,
} from '../../../consts';
import type { ShadePlotMode } from '../../../parser/objects';
import type { CommonDxfEntity } from '../shared';

export interface ViewportEntity extends CommonDxfEntity {
    type: 'VIEWPORT';
    /** Parsed by group code `100` */
    subclassMarker: string;
    /** Parsed by group code `10`, `20` and `30` (in WCS) */
    viewportCenter: Point3D;
    /** Parsed by group code `40` (in paper space unit) */
    width: number;
    /** Parsed by group code `41` (in paper space unit) */
    height: number;
    /**
     * Viewport status field:
     * 
     * - `-1`: On, but is fully off screen, or is one of the viewports that is not active because the $MAXACTVP count is currently being exceeded.
     * - `0`: Off
     * - `<positive>`: On and active. The value indicates the order of stacking for the viewports, where `1` is the active viewport, `2` is the next, and so forth
     * 
     * Parsed by group code `68` 
     */
    status: number;
    /** Parsed by group code `69` */
    viewportId: number;
    /** 
     * Represent the center point of the viewport on the display (in DCS).
     * 
     * Parsed by group code `12` and `22`
     * */
    displayCenter: Point2D;
    /** Parsed by group code `13` and `23` */
    snapBase: Point2D;
    /** Parsed by group code `14` and `24` */
    snapSpacing: Point2D;
    /** Parsed by group code `15` and `25` */
    gridSpacing: Point2D;
    /** 
     * View direction vector (in WCS)
     * 
     * Parsed by group code `16`, `26` and `36`
     * */
    viewDirection: Point3D;
    /** 
     * View target point (in WCS)
     * 
     * Parsed by group code `16`, `26` and `36`
     * */
    targetPoint: Point3D;
    /** Parsed by group code `42` */
    perspectiveLensLength: number;
    /** Parsed by group code `43` */
    frontClipZ: number;
    /** Parsed by group code `44` */
    backClipZ: number;
    /** 
     * View height (in model space units)
     * 
     * Parsed by group code `45` 
     * */
    viewHeight: number; 
    /** Parsed by group code `50` */
    snapAngle: number;
    /** Parsed by group code `51` */
    viewTwistAngle: number;
    /** Parsed by group code `72` */
    circleZoomPercent: number;
    /** Parsed by group code `331` */
    frozenLayerIds?: string[];
    /**
     * Viewport status bit-coded flags
     * 
     * Parsed by group code `90`
     * 
     * @see ViewportStatusFlag
     */
    statusBitFlags: number;
    /** 
     * Hard-pointer ID/handle to entity that serves as the viewport's clipping boundary 
     * (only present if viewport is non-rectangular) 
     * 
     * Parsed by group code `340`
     * */
    clippingBoundaryId?: string; // viewport가 직사각형 아닌 경우 경계선을 정의하는 entity id
    /**
     * Plot style sheet name assigned to this viewport
     * 
     * Parsed by group code `1`
     */
    sheetName: string;
    /** Parsed by group code `281` */
    renderMode: RenderMode;
    /** Parsed by group code `71` */
    ucsPerViewport: UCSPerViewport;
    /**
     * Display UCS icon at UCS origin flag: Controls whether UCS icon represents viewport UCS 
     * or current UCS (these will be different if UCSVP is `1` and viewport is not active). 
     * 
     * However, this field is currently being ignored and the icon always represents the viewport UCS
     * in AutoCAD.
     * 
     * Parsed by group code `74`.
     */
    iconFlag: 0 | 1;
    /** Parsed by group code `110`, `210` and `310`*/
    ucsOrigin?: Point3D;
    /** Parsed by group code `120`, `220` and `320`*/
    ucsXAxis?: Point3D;
    /** Parsed by group code `130`, `230` and `330`*/
    ucsYAxis?: Point3D;
    /**
     * ID/handle of `AcDbUCSTableRecord`
     * 
     * - If UCS is a named UCS
     * - If not present, then UCS is unnamed
     * 
     * Parsed by group code `345`.
     */
    ucsId?: string; // ID/handle of AcDbUCSTableRecord if UCS is a named UCS. If not present, then UCS is unnamed
    /**
     * ID/handle of AcDbUCSTableRecord of base UCS 
     * 
     * - If UCS is orthographic (79 code is non-zero)
     * - If not present and 79 code is non-zero, then base UCS is taken to be WORLD
     * 
     * Parsed by group code `346`.
     */
    ucsBaseId?: string; // ID/handle of AcDbUCSTableRecord of base UCS if UCS is orthographic. If it's not exists, taken to be WORLD
    /** Parsed by group code `79`. */
    orthographicType?: OrthographicType;
    /** Parsed by group code `146`. */
    elevation: number;
    /** Parsed by group code `170`. */
    shadePlotMode: ShadePlotMode;
    /**
     * Frequency of major grid lines compared to minor grid lines
     * 
     * Parsed by group code `61`.
     */
    majorGridFrequency: number;
    /** Parsed by group code `332`. */
    backgroundId?: string;
    /** Parsed by group code `333`. */
    shadePlotId?: string;
    /** Parsed by group code `348`. */
    visualStyleId?: string;
    /** 
     * Default lighting flag. On when no user lights are specified.
     * 
     * Parsed by group code `292`. 
     * */
    isDefaultLighting: boolean;
    /** Parsed by group code `282`. */
    defaultLightingType?: DefaultLightingType;
    /** Parsed by group code `141`. */
    brightness: number;
    /** Parsed by group code `142`. */
    contrast: number;
    /** 
     * Only exists if ambient light color is given in 16-bit color index
     * 
     * Parsed by group code `63`. 
     * */
    ambientLightColorIndex?: number;
    /** 
     * Only exists if ambient light color is given in 32-bit color instance
     * 
     * Parsed by group code `421`. 
     * */
    ambientLightColorInstance?: number;
    /** 
     * Only exists if ambient light color is given in string
     * 
     * Parsed by group code `431`. 
     * */
    ambientLightColorName?: string;
    /** Parsed by group code `361`. */
    sunId?: string;
    /**
     * Soft pointer reference to viewport object (for layer VP property override)
     * 
     * Parsed by group code `335`, `343`, `344` and `91`.
     */
    softPointers?: string[]
}
