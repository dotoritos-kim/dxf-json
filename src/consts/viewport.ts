export enum ViewportStatusFlag {
    PERSPECTIVE_MODE = 0x1,
    FRONT_CLIPPING = 0x2,
    BACK_CLIPPING = 0x4,
    UCS_FOLLOW = 0x8,
    FRONT_CLIP_NOT_AT_EYE = 0x10,
    UCS_ICON_VISIBILITY = 0x20,
    UCS_ICON_AT_ORIGIN = 0x40,
    FAST_ZOOM = 0x80,
    SNAP_MODE = 0x100,
    GRID_MODE = 0x200,
    ISOMETRIC_SNAP_STYLE = 0x400,
    HIDE_PLOT_MODE = 0x800,
    K_ISO_PAIR_TOP = 0x1000,
    K_ISO_PAIR_RIGHT = 0x2000,
    VIEWPORT_ZOOM_LOCKING = 0x4000,
    UNUSED = 0x8000,
    NON_RECTANGULAR_CLIPPING = 0x10000,
    VIEWPORT_OFF = 0x20000,
    GRID_BEYOND_DRAWING_LIMITS = 0x40000,
    ADAPTIVE_GRID_DISPLAY = 0x80000,
    SUBDIVISION_BELOW_SPACING = 0x100000,
    GRID_FOLLOWS_WORKPLANE = 0x200000,
}

export enum RenderMode {
    OPTIMIZED_2D = 0, // classic 2D
    WIREFRAME = 1,
    HIDDEN_LINE = 2,
    FLAT_SHADED = 3,
    GOURAUD_SHADED = 4,
    FLAT_SHADED_WITH_WIREFRAME = 5,
    GOURAUD_SHADED_WITH_WIREFRAME = 6,
}

// viewport가 개별 ucs를 가지고 있는지 여부
export enum UCSPerViewport {
    UCS_UNCHANGED = 0,
    HAS_OWN_UCS = 1,
}

export enum OrthographicType {
    NON_ORTHOGRAPHIC = 0,
    TOP = 1,
    BOTTOM = 2,
    FRONT = 3,
    BACK = 4,
    LEFT = 5,
    RIGHT = 6,
}

export enum ShadePlotMode {
    AS_DISPLAYED = 0,
    WIREFRAME = 1,
    HIDDEN = 2,
    RENDERED = 3,
}

export enum DefaultLightingType {
    ONE_DISTANT_LIGHT = 0,
    TWO_DISTANT_LIGHTS = 1,
}
