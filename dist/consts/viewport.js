"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLightingType = exports.ShadePlotMode = exports.OrthographicType = exports.UCSPerViewport = exports.RenderMode = exports.ViewportStatusFlag = void 0;
var ViewportStatusFlag;
(function (ViewportStatusFlag) {
    ViewportStatusFlag[ViewportStatusFlag["PERSPECTIVE_MODE"] = 1] = "PERSPECTIVE_MODE";
    ViewportStatusFlag[ViewportStatusFlag["FRONT_CLIPPING"] = 2] = "FRONT_CLIPPING";
    ViewportStatusFlag[ViewportStatusFlag["BACK_CLIPPING"] = 4] = "BACK_CLIPPING";
    ViewportStatusFlag[ViewportStatusFlag["UCS_FOLLOW"] = 8] = "UCS_FOLLOW";
    ViewportStatusFlag[ViewportStatusFlag["FRONT_CLIP_NOT_AT_EYE"] = 16] = "FRONT_CLIP_NOT_AT_EYE";
    ViewportStatusFlag[ViewportStatusFlag["UCS_ICON_VISIBILITY"] = 32] = "UCS_ICON_VISIBILITY";
    ViewportStatusFlag[ViewportStatusFlag["UCS_ICON_AT_ORIGIN"] = 64] = "UCS_ICON_AT_ORIGIN";
    ViewportStatusFlag[ViewportStatusFlag["FAST_ZOOM"] = 128] = "FAST_ZOOM";
    ViewportStatusFlag[ViewportStatusFlag["SNAP_MODE"] = 256] = "SNAP_MODE";
    ViewportStatusFlag[ViewportStatusFlag["GRID_MODE"] = 512] = "GRID_MODE";
    ViewportStatusFlag[ViewportStatusFlag["ISOMETRIC_SNAP_STYLE"] = 1024] = "ISOMETRIC_SNAP_STYLE";
    ViewportStatusFlag[ViewportStatusFlag["HIDE_PLOT_MODE"] = 2048] = "HIDE_PLOT_MODE";
    ViewportStatusFlag[ViewportStatusFlag["K_ISO_PAIR_TOP"] = 4096] = "K_ISO_PAIR_TOP";
    ViewportStatusFlag[ViewportStatusFlag["K_ISO_PAIR_RIGHT"] = 8192] = "K_ISO_PAIR_RIGHT";
    ViewportStatusFlag[ViewportStatusFlag["VIEWPORT_ZOOM_LOCKING"] = 16384] = "VIEWPORT_ZOOM_LOCKING";
    ViewportStatusFlag[ViewportStatusFlag["UNUSED"] = 32768] = "UNUSED";
    ViewportStatusFlag[ViewportStatusFlag["NON_RECTANGULAR_CLIPPING"] = 65536] = "NON_RECTANGULAR_CLIPPING";
    ViewportStatusFlag[ViewportStatusFlag["VIEWPORT_OFF"] = 131072] = "VIEWPORT_OFF";
    ViewportStatusFlag[ViewportStatusFlag["GRID_BEYOND_DRAWING_LIMITS"] = 262144] = "GRID_BEYOND_DRAWING_LIMITS";
    ViewportStatusFlag[ViewportStatusFlag["ADAPTIVE_GRID_DISPLAY"] = 524288] = "ADAPTIVE_GRID_DISPLAY";
    ViewportStatusFlag[ViewportStatusFlag["SUBDIVISION_BELOW_SPACING"] = 1048576] = "SUBDIVISION_BELOW_SPACING";
    ViewportStatusFlag[ViewportStatusFlag["GRID_FOLLOWS_WORKPLANE"] = 2097152] = "GRID_FOLLOWS_WORKPLANE";
})(ViewportStatusFlag || (exports.ViewportStatusFlag = ViewportStatusFlag = {}));
var RenderMode;
(function (RenderMode) {
    RenderMode[RenderMode["OPTIMIZED_2D"] = 0] = "OPTIMIZED_2D";
    RenderMode[RenderMode["WIREFRAME"] = 1] = "WIREFRAME";
    RenderMode[RenderMode["HIDDEN_LINE"] = 2] = "HIDDEN_LINE";
    RenderMode[RenderMode["FLAT_SHADED"] = 3] = "FLAT_SHADED";
    RenderMode[RenderMode["GOURAUD_SHADED"] = 4] = "GOURAUD_SHADED";
    RenderMode[RenderMode["FLAT_SHADED_WITH_WIREFRAME"] = 5] = "FLAT_SHADED_WITH_WIREFRAME";
    RenderMode[RenderMode["GOURAUD_SHADED_WITH_WIREFRAME"] = 6] = "GOURAUD_SHADED_WITH_WIREFRAME";
})(RenderMode || (exports.RenderMode = RenderMode = {}));
// viewport가 개별 ucs를 가지고 있는지 여부
var UCSPerViewport;
(function (UCSPerViewport) {
    UCSPerViewport[UCSPerViewport["UCS_UNCHANGED"] = 0] = "UCS_UNCHANGED";
    UCSPerViewport[UCSPerViewport["HAS_OWN_UCS"] = 1] = "HAS_OWN_UCS";
})(UCSPerViewport || (exports.UCSPerViewport = UCSPerViewport = {}));
var OrthographicType;
(function (OrthographicType) {
    OrthographicType[OrthographicType["NON_ORTHOGRAPHIC"] = 0] = "NON_ORTHOGRAPHIC";
    OrthographicType[OrthographicType["TOP"] = 1] = "TOP";
    OrthographicType[OrthographicType["BOTTOM"] = 2] = "BOTTOM";
    OrthographicType[OrthographicType["FRONT"] = 3] = "FRONT";
    OrthographicType[OrthographicType["BACK"] = 4] = "BACK";
    OrthographicType[OrthographicType["LEFT"] = 5] = "LEFT";
    OrthographicType[OrthographicType["RIGHT"] = 6] = "RIGHT";
})(OrthographicType || (exports.OrthographicType = OrthographicType = {}));
var ShadePlotMode;
(function (ShadePlotMode) {
    ShadePlotMode[ShadePlotMode["AS_DISPLAYED"] = 0] = "AS_DISPLAYED";
    ShadePlotMode[ShadePlotMode["WIREFRAME"] = 1] = "WIREFRAME";
    ShadePlotMode[ShadePlotMode["HIDDEN"] = 2] = "HIDDEN";
    ShadePlotMode[ShadePlotMode["RENDERED"] = 3] = "RENDERED";
})(ShadePlotMode || (exports.ShadePlotMode = ShadePlotMode = {}));
var DefaultLightingType;
(function (DefaultLightingType) {
    DefaultLightingType[DefaultLightingType["ONE_DISTANT_LIGHT"] = 0] = "ONE_DISTANT_LIGHT";
    DefaultLightingType[DefaultLightingType["TWO_DISTANT_LIGHTS"] = 1] = "TWO_DISTANT_LIGHTS";
})(DefaultLightingType || (exports.DefaultLightingType = DefaultLightingType = {}));
//# sourceMappingURL=viewport.js.map