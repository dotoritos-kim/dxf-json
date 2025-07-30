export enum PlotPaperUnit {
    INCHES = 0,
    MILLIMETERS = 1,
    PIXELS = 2,
}

export enum PlotType {
    LAST_SCREEN_DISPLAY = 0,
    DRAWING_EXTENTS = 1,
    DRAWING_LIMITS = 2,
    VIEW_SPECIFIED = 3, // specified in plotViewName
    WINDOW_SPECIFIED = 4, // specified in plotViewName
    LAYOUT_INFORMATION = 5,
}

export enum ShadePlotMode {
    AS_DISPLAYED = 0,
    WIREFRAME = 1,
    HIDDEN = 2,
    RENDERED = 3,
}

export enum ShadePlotResolution {
    DRAFT = 0,
    PREVIEW = 1,
    NORMAL = 2,
    PRESENTATION = 3,
    MAXIMUM = 4,
    CUSTOM = 5,
}
