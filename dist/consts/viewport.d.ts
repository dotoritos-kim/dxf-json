export declare enum ViewportStatusFlag {
    PERSPECTIVE_MODE = 1,
    FRONT_CLIPPING = 2,
    BACK_CLIPPING = 4,
    UCS_FOLLOW = 8,
    FRONT_CLIP_NOT_AT_EYE = 16,
    UCS_ICON_VISIBILITY = 32,
    UCS_ICON_AT_ORIGIN = 64,
    FAST_ZOOM = 128,
    SNAP_MODE = 256,
    GRID_MODE = 512,
    ISOMETRIC_SNAP_STYLE = 1024,
    HIDE_PLOT_MODE = 2048,
    K_ISO_PAIR_TOP = 4096,
    K_ISO_PAIR_RIGHT = 8192,
    VIEWPORT_ZOOM_LOCKING = 16384,
    UNUSED = 32768,
    NON_RECTANGULAR_CLIPPING = 65536,
    VIEWPORT_OFF = 131072,
    GRID_BEYOND_DRAWING_LIMITS = 262144,
    ADAPTIVE_GRID_DISPLAY = 524288,
    SUBDIVISION_BELOW_SPACING = 1048576,
    GRID_FOLLOWS_WORKPLANE = 2097152
}
export declare enum RenderMode {
    OPTIMIZED_2D = 0,// classic 2D
    WIREFRAME = 1,
    HIDDEN_LINE = 2,
    FLAT_SHADED = 3,
    GOURAUD_SHADED = 4,
    FLAT_SHADED_WITH_WIREFRAME = 5,
    GOURAUD_SHADED_WITH_WIREFRAME = 6
}
export declare enum UCSPerViewport {
    UCS_UNCHANGED = 0,
    HAS_OWN_UCS = 1
}
export declare enum OrthographicType {
    NON_ORTHOGRAPHIC = 0,
    TOP = 1,
    BOTTOM = 2,
    FRONT = 3,
    BACK = 4,
    LEFT = 5,
    RIGHT = 6
}
export declare enum ShadePlotMode {
    AS_DISPLAYED = 0,
    WIREFRAME = 1,
    HIDDEN = 2,
    RENDERED = 3
}
export declare enum DefaultLightingType {
    ONE_DISTANT_LIGHT = 0,
    TWO_DISTANT_LIGHTS = 1
}
