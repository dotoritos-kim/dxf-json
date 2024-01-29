export declare enum HatchSolidFill {
    PatternFill = 0,
    SolidFill = 1
}
export declare enum HatchAssociativity {
    NonAssociative = 0,// For MPolygon LacksSolidFill
    Associative = 1
}
export declare enum HatchStyle {
    Normal = 0,// Odd parity area
    Outer = 1,// Outermost area
    Ignore = 2
}
export declare enum HatchPatternType {
    UserDefined = 0,
    Predefined = 1,
    Custom = 2
}
export declare enum HatchBoundaryAnnotation {
    NotAnnotated = 0,
    Annotated = 1
}
export declare enum HatchGradientFlag {
    Solid = 0,
    Gradient = 1
}
export declare enum HatchGradientColorFlag {
    TwoColor = 0,
    OneColor = 1
}
export declare enum BoundaryPathTypeFlag {
    Default = 0,
    External = 1,
    Polyline = 2,
    Derived = 4,
    Textbox = 8,
    Outermost = 16
}
export declare enum BoundaryPathEdgeType {
    Line = 1,
    Circular = 2,
    Elliptic = 3,
    Spline = 4
}
