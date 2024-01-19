// https://help.autodesk.com/view/OARX/2023/ENU/?guid=GUID-EDD54EAC-A339-4EBA-AEA6-EC8066505E2B
export enum DimensionType {
    Rotated = 0,
    Aligned = 1,
    Angular = 2,
    Diameter = 3,
    Radius = 4,
    Angular3Point = 5,
    Ordinate = 6,
    ReferenceIsExclusive = 32,
    IsOrdinateXTypeFlag = 64,
    IsCustomTextPositionFlag = 128,
}

export enum AttachmentPoint {
    TopLeft = 1,
    TopCenter = 2,
    TopRight = 3,
    MiddleLeft = 4,
    MiddleCenter = 5,
    MiddleRight = 6,
    BottomLeft = 7,
    BottomCenter = 8,
    BottomRight = 9,
}

export enum DimensionTextLineSpacing {
    AtLeast = 1,
    Exact = 2,
}

export enum DimensionTextVertical {
    Center = 0,
    Above = 1,
    Outside = 2,
    JIS = 3,
    Below = 4,
}

export enum DimensionZeroSuppression {
    Feet = 0,
    None = 1,
    Inch = 2,
    FeetAndInch = 3,
    Leading = 4,
    Trailing = 8,
    LeadingAndTrailing = 12,
}

export enum DimensionZeroSuppressionAngular {
    None = 0,
    Leading = 1,
    Trailing = 2,
    LeadingAndTrailing = 3,
}

export enum DimensionTextHorizontal {
    Center = 0,
    Left = 1,
    Right = 2,
    OverFirst = 3,
    OverSecond = 4,
}

export enum DimensionToleranceTextVertical {
    Bottom = 0,
    Center = 1,
    Top = 2,
}
