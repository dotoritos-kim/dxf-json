export enum VertexFlag {
    CREATED_BY_CURVE_FIT = 1,
    TANGENT_DEFINED = 2,
    NOT_USED = 4,
    CREATED_BY_SPLINE_FIT = 8,
    SPLINE_CONTROL_POINT = 16,
    FOR_POLYLINE = 32,
    FOR_POLYGON = 64,
    POLYFACE = 128,
}
