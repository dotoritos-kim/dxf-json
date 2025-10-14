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

/**
 * Sets dimension text movement rules.
 * 
 * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-10475059-6A2E-40B2-AF30-E92F104E9C03
 */
export enum DimensionTextMoveRule {
    /** Moves the dimension line with dimension text */
    WithDimension = 0,
    /** Adds a leader when dimension text is moved */
    AddLeader = 1,
    /** Allows text to be moved freely without a leader */
    Independent = 2,
}

/**
 * Determines how dimension text and arrows are arranged when space is not sufficient to place both within the extension lines.
 * 
 * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-2F8FA7E7-C79F-40EA-A416-C4B02D09F310
 */
export enum DimensionTextFit {
    /** Places both text and arrows outside extension lines */
    BothOutside = 0,
    /** Moves arrows first, then text */
    ArrowFirst = 1,
    /** Moves text first, then arrows */
    TextFirst = 2,
    /** Moves either text or arrows, whichever fits best */
    Auto = 3,
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

/**
 * Suppresses zeros for angular dimensions.
 * 
 * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-69E9BFD3-06A4-468D-88F0-7C9741407194
 */
export enum DimensionZeroSuppressionAngular {
    /** Displays all leading and trailing zeros */
    None = 0,
    /** Suppresses leading zeros in decimal dimensions (for example, `0.5000` becomes `.5000`) */
    Leading = 1,
    /** Suppresses trailing zeros in decimal dimensions (for example, `12.5000` becomes `12.5`) */
    Trailing = 2,
    /** Suppresses leading and trailing zeros (for example, `0.5000` becomes `.5`) */
    LeadingAndTrailing = 3,
}

/**
 * Justify horizontal alignment of dimension text 
 */
export enum DimensionTextHorizontal {
    /** Positions the text above the dimension line and center-justifies it between the extension lines */
    Center = 0,
    /** Above dimension line and next to first extension line */
    First = 1,
    /** Above dimension line and next to second extension line */
    Second = 2,
    /** 
     * Above and center-justified to first extension line
     * 
     * In linear dimension, typically it's rotated in 90 degrees to extension line.
     */
    OverFirst = 3,
    /** 
     * Above and center-justified to second extension line
     * 
     * In linear dimension, typically it's rotated in 90 degrees to extension line.
     */
    OverSecond = 4,
}

export enum DimensionToleranceTextVertical {
    Bottom = 0,
    Center = 1,
    Top = 2,
}

/**
 * Controls the background of dimension text.
 * 
 * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-4E38E29F-DE85-4791-A2E7-4DC22842B1B4
 */
export enum DimensionTextFill {
    /** No background */
    None = 0,
    /** The background color of the drawing */
    UseDrawingBackground = 1,
    /** The background specified by DIMTFILLCLR */
    Custom = 2,
}

/**
 * Sets the fraction format when `DIMLUNIT` is set to `4` (`Architectural`) or `5` (`Fractional`)
 * 
 * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-6A35A398-ED55-4EC3-88F2-23F6FBADF1BE
 */
export enum DimensionFractionFormat {
    Horizontal = 0,
    Diagonal = 1,
    /** For example, 1/2 */
    NotStacked = 2,
}

/**
 * Sets units for all dimension types **except Angular**.
 * 
 * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-2ECDF7CF-6EEA-4174-B50C-8630D5002C20
 */
export enum DimensionUnit {
    Scientific = 1,
    Decimal = 2,
    Engineering = 3,
    /** Always displayed stacked */
    Architectural = 4,
    /** Always displayed stacked */
    Fractional = 5,
    /** Decimal format using Control Panel settings for decimal separator and number grouping symbols */
    WindowDesktop = 6,
}

/**
 * Sets the units format for angular dimensions.
 * 
 * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-30F44A49-4250-42D1-AEF2-5E2914ADB02B
 */
export enum DimensionAngularUnit {
    Decimal = 0,
    DegreesMinutesSecond = 1,
    Gradian = 2,
    Radian = 3,
}