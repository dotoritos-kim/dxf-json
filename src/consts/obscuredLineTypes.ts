/**
 * Specifies the linetype of obscured lines.
 * Obscured linetypes are independent of zoom level,
 * unlike standard object linetypes.
 *
 * Value 0 turns off display of obscured lines and is the default
 * */
export enum ObscuredLineTypes {
    Off = 0,
    Solid = 1,
    Dashed = 2,
    Dotted = 3,
    ShotDash = 4,
    MediumDash = 5,
    LongDash = 6,
    DoubleShortDash = 7,
    DoubleMediumDash = 8,
    DoubleLongDash = 9,
    DoubleMediumLongDash = 10,
    SparseDot = 11,
}
