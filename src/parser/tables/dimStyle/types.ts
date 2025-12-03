import type {
  DimensionAngularUnit,
  DimensionFractionFormat,
  DimensionTextFill,
  DimensionTextHorizontal,
  DimensionTextVertical,
  DimensionUnit,
  DimensionZeroSuppression,
  DimensionZeroSuppressionAngular,
} from '../../../consts/dimension.ts'
import type { ArcSymbolType } from '../../entities/arc_dimension/consts.ts'
import type { CommonDxfTableEntry } from '../types.ts'

/**
 * Union of all possible dimension style variable names.
 *
 * @see DimStyleVariables
 * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=GUID-F2FAD36F-0CE3-4943-9DAD-A9BCD2AE81DA
 */
export type DimStyleVariable =
  | 'DIMPOST'
  | 'DIMAPOST'
  | 'DIMBLK_OBSOLETE'
  | 'DIMBLK1_OBSOLETE'
  | 'DIMBLK2_OBSOLETE'
  | 'DIMSCALE'
  | 'DIMASZ'
  | 'DIMEXO'
  | 'DIMDLI'
  | 'DIMEXE'
  | 'DIMRND'
  | 'DIMDLE'
  | 'DIMTP'
  | 'DIMTM'
  | 'DIMFXL'
  | 'DIMJOGANG'
  | 'DIMTFILL'
  | 'DIMTFILLCLR'
  | 'DIMTOL'
  | 'DIMLIM'
  | 'DIMTIH'
  | 'DIMTOH'
  | 'DIMSE1'
  | 'DIMSE2'
  | 'DIMTAD'
  | 'DIMZIN'
  | 'DIMAZIN'
  | 'DIMARCSYM'
  | 'DIMTXT'
  | 'DIMCEN'
  | 'DIMTSZ'
  | 'DIMALTF'
  | 'DIMLFAC'
  | 'DIMTVP'
  | 'DIMTFAC'
  | 'DIMGAP'
  | 'DIMALTRND'
  | 'DIMALT'
  | 'DIMALTD'
  | 'DIMTOFL'
  | 'DIMSAH'
  | 'DIMTIX'
  | 'DIMSOXD'
  | 'DIMCLRD'
  | 'DIMCLRE'
  | 'DIMCLRT'
  | 'DIMADEC'
  | 'DIMUNIT'
  | 'DIMDEC'
  | 'DIMTDEC'
  | 'DIMALTU'
  | 'DIMALTTD'
  | 'DIMAUNIT'
  | 'DIMFRAC'
  | 'DIMLUNIT'
  | 'DIMDSEP'
  | 'DIMTMOVE'
  | 'DIMJUST'
  | 'DIMSD1'
  | 'DIMSD2'
  | 'DIMTOLJ'
  | 'DIMTZIN'
  | 'DIMALTZ'
  | 'DIMALTTZ'
  | 'DIMFIT'
  | 'DIMUPT'
  | 'DIMATFIT'
  | 'DIMFXLON'
  | 'DIMTXTDIRECTION'
  | 'DIMTXSTY'
  | 'DIMLDRBLK'
  | 'DIMBLK'
  | 'DIMBLK1'
  | 'DIMBLK2'
  | 'DIMLTYPE'
  | 'DIMLTEX1'
  | 'DIMLTEX2'
  | 'DIMLWD'
  | 'DIMLWE'

export interface DimStyleVariableSchema {
  name: string
  code: number
  defaultValue?: string | number
  defaultValueImperial?: string | number
}

/**
 * Key-value pairs of dimension style variables. Useful when combined with `DimStyleVariable`.
 *
 * @see DimStyleVariable
 */
export type DimStyleVariables = {
  /**
   * Specifies a text prefix or suffix (or both) to the dimension measurement.
   *
   * For example, to establish a suffix for millimeters, set `DIMPOST` to mm;
   * a distance of 19.2 units would be displayed as `19.2 mm`.
   *
   * If tolerances are turned on, the suffix is applied to the tolerances as well as to
   * the main dimension.
   *
   * Use `<>` to indicate placement of the text in relation to the dimension value.
   * Use the `<>` mechanism for angular dimensions.
   *
   * Parsed by group code `3`
   *
   * @example
   * ```
   * "<>mm" → "5.0mm"
   * "mm <>" → "mm 5.0"
   * ```
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-79CCF9B1-BE33-4158-891C-50E4BF795D8E
   */
  DIMPOST?: string
  /**
   * Specifies a text prefix or suffix (or both) to the alternate dimension measurement
   * for all types of dimensions **except angular**.
   *
   * For instance, if the current units are `Architectural`, `DIMALT` is on, `DIMALTF` is 25.4
   * (the number of millimeters per inch), `DIMALTD` is `2`, and `DIMAPOST` is set to `"mm"`,
   * a distance of 10 units would be displayed as `10"[254.00mm]`.
   *
   * Parsed by group code `4`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-AEA9448D-CC01-404B-AFA0-055B9C2F21EE
   */
  DIMAPOST?: string
  /**
   * Obsolete. Use `DIMBLK` instead.
   *
   * Parsed by group code `5`
   */
  DIMBLK_OBSOLETE?: string
  /**
   * Obsolete. Use `DIMBLK1` instead.
   *
   * Parsed by group code `6`
   */
  DIMBLK1_OBSOLETE?: string
  /**
   * Obsolete. Use `DIMBLK1` instead.
   *
   * Parsed by group code `7`
   */
  DIMBLK2_OBSOLETE?: string
  /**
   * Sets the overall scale factor applied to dimensioning variables that specify sizes,
   * distances, or offsets.
   *
   * Affects `DIMENSION`, `ARC_DIMENSION`, `LEADER` and `MLEADER`.
   *
   * `DIMSCALE` does not affect measured lengths, coordinates, or angles.
   *
   * If the current dimension style is annotative, `DIMSCALE` is automatically set to zero
   * and the dimension scale is controlled by the `CANNOSCALE` system variable.
   *
   * `DIMSCALE` cannot be set to a non-zero value when using annotative dimensions.
   *
   * - `0`: A reasonable default value is computed based on the scaling between the current
   *   model space viewport and paper space. If you are in paper space or model space and
   *   not using the paper space feature, the scale factor is `1.0`.
   * - otherwise: A scale factor is computed that leads text sizes, arrowhead sizes, and other
   *   scaled distances to plot at their face values.
   *
   * Parsed by group code `40`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-AEA309F0-B831-4432-8085-FB6CD49CDC78
   */
  DIMSCALE: number
  /**
   * Controls the size of dimension line and leader line arrowheads. Also controls the size of hook lines.
   *
   * Multiples of the arrowhead size determine whether dimension lines and text should fit between
   * the extension lines. `DIMASZ` is also used to scale arrowhead blocks if set by `DIMBLK`.
   *
   * `DIMASZ` has no effect when `DIMTSZ` is other than zero.
   *
   * Parsed by group code `41`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-43E31690-BA17-4AD6-82D1-E7809BD1298A
   */
  DIMASZ: number
  /**
   * Specifies how far extension lines are offset from origin points.
   *
   * With fixed-length extension lines, this value determines the minimum offset.
   *
   * Parsed by group code `42`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-5CF50ABD-1F77-4609-BEB5-A129BF7DD746
   */
  DIMEXO: number
  /**
   * Controls the spacing of the dimension lines in baseline dimensions.
   *
   * Each dimension line is offset from the previous one by this amount, if necessary, to avoid drawing over it.
   *
   * Changes made with `DIMDLI` are not applied to existing dimensions.
   *
   * Parsed by group code `43`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-D2D1AF3D-004B-4C47-BABE-22B7327EE128
   */
  DIMDLI: number
  /**
   * Specifies how far to extend the extension line beyond the dimension line.
   *
   * Parsed by group code `44`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-508D4589-3C3E-4B5E-BA2C-539809197A71
   */
  DIMEXE: number
  /**
   * Rounds all dimensioning distances to the specified value.
   *
   * For instance, if `DIMRND` is set to `0.25`, all distances round to the nearest `0.25` unit.
   * If you set `DIMRND` to `1.0`, all distances round to the nearest integer.
   *
   * Note that the number of digits edited after the decimal point depends on the precision
   * set by `DIMDEC`.
   *
   * `DIMRND` does not apply to angular dimensions.
   *
   * Parsed by group code `45`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-215CF615-1AA7-45E5-9D0F-CF9693ABCCB9
   */
  DIMRND: number
  /**
   * Sets the distance the dimension line extends beyond the extension line when oblique strokes
   * are drawn instead of arrowheads.
   *
   * Parsed by group code `46`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-C66183C7-D872-41F2-8815-D7479F2A87F6
   */
  DIMDLE: number
  /**
   * Sets the maximum (or upper) tolerance limit for dimension text when `DIMTOL` or `DIMLIM` is on.
   *
   * `DIMTP` accepts signed values. If `DIMTOL` is on and `DIMTP` and `DIMTM` are set to the
   * same value, a tolerance value is drawn.
   *
   * If `DIMTM` and `DIMTP` values differ, the upper tolerance is drawn above the lower and a plus
   * sign is added to the `DIMTP` value if it is positive.
   *
   * Parsed by group code `47`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-635300D6-9738-44C4-A0B6-176F194533B3
   */
  DIMTP: number
  /**
   * Sets the minimum (or lower) tolerance limit for dimension text when `DIMTOL` or `DIMLIM` is on.
   *
   * `DIMTM` accepts signed values. If `DIMTOL` is on and `DIMTP` and `DIMTM` are set to the same value,
   * a tolerance value is drawn.
   *
   * If `DIMTM` and `DIMTP` values differ, the upper tolerance is drawn above the lower, and a plus
   * sign is added to the `DIMTP` value if it is positive.
   *
   * For `DIMTM`, the program uses the negative of the value you enter (adding a minus sign if you
   * specify a positive number and a plus sign if you specify a negative number).
   *
   * Parsed by group code `48`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-E2AAD7FB-C563-42A8-B7B4-3A3EC8AA8C68
   */
  DIMTM: number
  /**
   * Sets the total length of the extension lines starting from the dimension line toward the dimension origin.
   *
   * Parsed by group code `49`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-CC0F54D4-688B-4A14-9926-9840BCB30FCA
   */
  DIMFXL: number
  /**
   * Determines the angle of the transverse segment of the dimension line in a jogged radius dimension.
   *
   * Jogged radius dimensions are often created when the center point is located off the page.
   *
   * Valid settings range is `5` to `90`.
   *
   * Parsed by group code `50`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-9C23D722-0792-4585-A40A-B8E3A191999A
   */
  DIMJOGANG: number
  /**
   * Controls the background of dimension text.
   *
   * Parsed by group code `69`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-4E38E29F-DE85-4791-A2E7-4DC22842B1B4
   */
  DIMTFILL: DimensionTextFill
  /**
   * Sets the color for the text background in dimensions.
   *
   * Color numbers are displayed in the Select Color dialog box.
   *
   * - `0`: BYBLOCK
   * - `256`: BYLAYER
   * - `1-255`: ACI color number
   *
   * Parsed by group code `70`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-FF6E5A28-35F0-4998-BC72-9EFD4EACCE18
   */
  DIMTFILLCLR: number
  /**
   * Appends tolerances to dimension text.
   *
   * Setting `DIMTOL` to on (`1`) turns `DIMLIM` off (`0`).
   *
   * Parsed by group code `71`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-1FA5DC50-8D40-49A5-9A79-08A4E01D6178
   */
  DIMTOL: number
  /**
   * Generates dimension limits as the default text.
   *
   * Setting `DIMLIM` to On turns `DIMTOL` off.
   *
   * Parsed by group code `72`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-271D1152-D76D-4FD1-B91B-50F8671012A4
   */
  DIMLIM: number
  /**
   * Controls the position of dimension text inside the extension lines for all dimension types
   * **except Ordinate**.
   *
   * - `0` Aligns text with the dimension line
   * - `1` Draws text horizontally
   *
   * Parsed by group code `73`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-60CFA531-80FD-45EF-B529-F4FAF5C758B3
   */
  DIMTIH: number
  /**
   * Controls the position of dimension text outside the extension lines.
   *
   * - `0` Aligns text with the dimension line
   * - `1` Draws text horizontally
   *
   * Parsed by group code `74`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-71B03AC9-ADC1-4859-A9CD-85247BACABBE
   */
  DIMTOH: number
  /**
   * Suppresses display of the first extension line.
   *
   * - `0` Extension line is not suppressed
   * - `1` Extension line is suppressed
   *
   * Parsed by group code `75`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-491A0E6F-0387-4169-BCB9-40F2432C0B99
   */
  DIMSE1: 0 | 1
  /**
   * Suppresses display of the second extension line.
   *
   * - `0` Extension line is not suppressed
   * - `1` Extension line is suppressed
   *
   * Parsed by group code `76`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-A2711B05-7F7E-472C-B53E-03B1F168FFEB
   */
  DIMSE2: 0 | 1
  /**
   * Controls the vertical position of text in relation to the dimension line.
   *
   * Parsed by group code `77`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-60D1241D-CEA7-4493-BD6A-4EF433F3C946
   */
  DIMTAD: DimensionTextVertical
  /**
   * Controls the suppression of zeros in the primary unit value.
   *
   * Values `0` ~ `3` affect feet-and-inch dimensions only
   *
   * Parsed by group code `78`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-A1860981-FE1C-4947-927B-7CD6B8CEF8EE
   */
  DIMZIN: DimensionZeroSuppression
  /**
   * Suppresses zeros for angular dimensions.
   *
   * Parsed by group code `79`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-69E9BFD3-06A4-468D-88F0-7C9741407194
   */
  DIMAZIN: DimensionZeroSuppressionAngular
  /**
   * Controls display of the arc symbol in an arc length dimension.
   *
   * Parsed by group code `90`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-1B843AB0-7976-4DD9-9464-6B0A71A34D81
   */
  DIMARCSYM: ArcSymbolType
  /**
   * Specifies the height of dimension text, unless the current text style has a fixed height.
   *
   * Parsed by group code `140`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-A17A69D7-25EF-4F57-B4EB-D53A56AB909C
   */
  DIMTXT: number
  /**
   * Controls drawing of circle or arc center marks and centerlines by the `DIMCENTER`, `DIMDIAMETER`, and `DIMRADIUS` commands.
   *
   * For `DIMDIAMETER` and `DIMRADIUS`, the center mark is drawn only if you place the dimension line outside the circle or arc.
   *
   * - `= 0` No center marks or lines are drawn
   * - `< 0` Centerlines are drawn
   * - `> 0` Center marks are drawn
   *
   * Parsed by group code `141`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-19D6EC14-F800-48FC-B459-28E5E7F81DBB
   */
  DIMCEN: number
  /**
   * Specifies the size of oblique strokes drawn instead of arrowheads for linear, radius, and diameter dimensioning.
   *
   * - `= 0` Draws arrowheads.
   * - `> 0` Draws oblique strokes instead of arrowheads. The size of the oblique strokes is determined by this value multiplied by the `DIMSCALE` value.
   *
   * Parsed by group code `142`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-D225D167-A66B-4617-BC59-C1385069D152
   */
  DIMTSZ: number
  /**
   * Controls the multiplier for alternate units.
   *
   * If `DIMALT` is turned on, `DIMALTF` multiplies linear dimensions by a factor to produce a value
   * in an alternate system of measurement. The initial value represents the number of millimeters in an inch.
   *
   * Parsed by group code `143`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-4BB25870-8BFF-478D-8C04-88457311AAF2
   */
  DIMALTF: number
  /**
   * All linear dimension distances, including radial, diameters, and coordinates, are multiplied by
   * `DIMLFAC` before being converted to dimension text.
   *
   * - `> 0` applied to dimensions in both model space and paper space
   * - `< 0` applied to paper space only
   *
   * `DIMLFAC` applies primarily to nonassociative dimensions (`DIMASSOC` set `0` or `1`). For nonassociative dimensions in paper space, `DIMLFAC` must be set individually for each
   * layout viewport to accommodate viewport scaling.
   *
   * `DIMLFAC` has no effect on angular dimensions, and is not applied to the values held in `DIMRND`,
   * `DIMTM`, or `DIMTP`.
   *
   * Parsed by group code `144`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-B6063785-B199-4A9A-8BD7-2108EB0AB7ED
   */
  DIMLFAC: number
  /**
   * Controls the vertical position of dimension text above or below the dimension line.
   *
   * The `DIMTVP` value is used when `DIMTAD` is off. The magnitude of the vertical offset of text is
   * the product of the text height and `DIMTVP`.
   *
   * Setting `DIMTVP` to `1.0` is equivalent to setting `DIMTAD` to on.
   *
   * The dimension line splits to accommodate the text only if the absolute value of `DIMTVP` is less than `0.7`.
   *
   * Parsed by group code `145`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-248E5BFA-F355-4369-A889-291D77070B26
   */
  DIMTVP: number
  /**
   * Specifies a scale factor for the text height of fractions and tolerance values relative to the dimension
   * text height, as set by `DIMTXT`.
   *
   * For example, if `DIMTFAC` is set to `1.0`, the text height of fractions and tolerances is the same height
   * as the dimension text. If `DIMTFAC` is set to `0.7500`, the text height of fractions and tolerances is
   * three-quarters the size of dimension text.
   *
   * Parsed by group code `146`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-0D3CBEEB-CF89-4979-BE42-A123357188DE
   */
  DIMTFAC: number
  /**
   * Sets the distance around the dimension text when the dimension line breaks to accommodate dimension text.
   *
   * Also sets the gap between annotation and a hook line created with the LEADER command.
   *
   * If you enter a negative value, `DIMGAP` places a box around the dimension text.
   *
   * The value of `DIMGAP` is also used as the minimum length of each segment of the dimension line.
   * To locate the components of a linear dimension within the extension lines, enough space must be
   * available for both arrowheads (2 x `DIMASZ`), both dimension line segments (2 x `DIMGAP`), a
   * gap on either side of the dimension text (another 2 x `DIMGAP`), and the length of the dimension text,
   * which depends on its size and number of decimal places displayed.
   *
   * Parsed by group code `147`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-EB367187-A5D6-404A-8121-A6D1D25B626A
   */
  DIMGAP: number
  /**
   * Rounds off the alternate dimension units.
   *
   * Parsed by group code `148`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-B67093DA-6B0D-4E32-8A33-6298A770CAAF
   */
  DIMALTRND: number
  /**
   * Controls the display of alternate units in dimensions.
   *
   * - `0` Disables alternate units
   * - `1` Enables alternate units
   *
   * Parsed by group code `170`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-D3B737AB-53B7-431E-A794-746DD2EB6209
   */
  DIMALT: 0 | 1
  /**
   * Controls the number of decimal places in alternate units.
   *
   * If `DIMALT` is turned on, `DIMALTD` sets the number of digits displayed to the right of the
   * decimal point in the alternate measurement.
   *
   * Parsed by group code `171`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-DE3D35C1-C4AB-4A11-9F3A-6E5CF6EE9160
   */
  DIMALTD: number
  /**
   * Controls whether a dimension line is drawn between the extension lines even when the text
   * is placed outside.
   *
   * For radius and diameter dimensions, a dimension line is drawn inside the circle or arc
   * when the text, arrowheads, and leader are placed outside.
   *
   * - `0` Does not draw dimension lines between the measured points when arrowheads are placed
   *       outside the measured points
   * - `1` Draws dimension lines between the measured points even when arrowheads are placed
   *       outside the measured points
   *
   * Parsed by group code `172`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-40D7439D-C805-4373-879A-E19ACE97FE54
   */
  DIMTOFL: 0 | 1
  /**
   * Controls the display of dimension line arrowhead blocks.
   *
   * - `0` Use arrowhead blocks set by `DIMBLK`
   * - `1` Use arrowhead blocks set by `DIMBLK1` and `DIMBLK2`
   *
   * Parsed by group code `173`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-1B912FA4-3D88-42BC-93B4-D329DB5DBF1F
   */
  DIMSAH: 0 | 1
  /**
   * Draws text between extension lines.
   *
   * - `0` For linear and angular dimensions, dimension text is placed inside the extension lines if
   *    there is sufficient room.
   * - `1` Draws dimension text between the extension lines even if it would ordinarily be placed
   *    outside those lines. For radius and diameter dimensions, `DIMTIX` on always forces the dimension
   *    text outside the circle or arc.
   *
   * Parsed by group code `174`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-A553FB59-8741-4500-A7ED-15B02A1F3470
   */
  DIMTIX: 0 | 1
  /**
   * Suppresses arrowheads if not enough space is available inside the extension lines.
   *
   * - `0` Arrowheads are not suppressed
   * - `1` Arrowheads are suppressed
   *
   * Parsed by group code `175`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-79F0441D-60E2-49AE-80F1-093A5BB588E2
   */
  DIMSOXD: 0 | 1
  /**
   * Assigns colors to dimension lines, arrowheads, and dimension leader lines.
   *
   * Also controls the color of leader lines created with the `LEADER` command.
   *
   * - `0` BYBLOCK
   * - `256` BYLAYER
   *
   * Parsed by group code `176`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-D229D47D-CFF5-461B-BB6F-96A6077D8A81
   */
  DIMCLRD: number
  /**
   * Assigns colors to extension lines, center marks, and centerlines.
   *
   * - `0` BYBLOCK
   * - `256` BYLAYER
   *
   * Parsed by group code `177`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-9A0E97A2-79E8-49BD-8BE6-88BD802452B0
   */
  DIMCLRE: number
  /**
   * Assigns colors to dimension text.
   *
   * The color can be any valid color number.
   *
   * Parsed by group code `178`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-58388D9A-F3E9-442D-8739-816BDE1DD07E
   */
  DIMCLRT: number
  /**
   * Controls the number of precision places displayed in angular dimensions.
   *
   * - `-1` Angular dimensions display the number of decimal places specified by `DIMDEC`
   * - `0 ~ 8` Specifies the number of decimal places displayed in angular dimensions (independent of `DIMDEC`)
   *
   * Parsed by group code `179`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-E5C2F9AA-5017-4111-A485-E0456225D691
   */
  DIMADEC: number
  /**
   * Obsolete. Use `DIMLUNIT` instead.
   *
   * Parsed by group code `270`
   *
   * @see https://help.autodesk.com/view/OARX/2025/ENU/?guid=OARX-RefGuide-AcDbDimension__dimunit
   */
  DIMUNIT?: number
  /**
   * Sets the number of decimal places displayed for the primary units of a dimension.
   *
   * The precision is based on the units or angle format you have selected. Specified value is
   * applied to angular dimensions when `DIMADEC` is set to `-1`.
   *
   * Parseed by group code `271`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-8F311450-A848-4682-81A5-D0EC6E3499C9
   */
  DIMDEC: number
  /**
   * Sets the number of decimal places to display in tolerance values for the primary units
   * in a dimension.
   *
   * This system variable has no effect unless `DIMTOL` is set to On.
   *
   * The default for `DIMTOL` is Off.
   *
   * Parsed by group code `272`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-49EAC810-F707-464B-852D-F0B8D5BC3588
   */
  DIMTDEC: number
  /**
   * Sets the units format for alternate units of all dimension substyles **except Angular**.
   *
   * Parsed by group code `273`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-3A2EA9D7-30C7-4C89-A09F-DD2AB74B9D13
   */
  DIMALTU: DimensionUnit
  /**
   * Sets the number of decimal places for the tolerance values in the alternate units of a dimension.
   *
   * Parsed by group code `274`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-4C0568B5-2655-4906-8BAC-3CA273007825
   */
  DIMALTTD: number
  /**
   * Sets the units format for angular dimensions.
   *
   * Parsed by group code `275`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-30F44A49-4250-42D1-AEF2-5E2914ADB02B
   */
  DIMAUNIT: DimensionAngularUnit
  /**
   * Sets the fraction format when `DIMLUNIT` is set to `4` (`Architectural`) or `5` (`Fractional`).
   *
   * Parsed by group code `276`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-6A35A398-ED55-4EC3-88F2-23F6FBADF1BE
   */
  DIMFRAC: DimensionFractionFormat
  /**
   * Sets units for all dimension types **except Angular**.
   *
   * Parsed by group code `277`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-2ECDF7CF-6EEA-4174-B50C-8630D5002C20
   */
  DIMLUNIT: number
  /**
   * Specifies a single-character decimal separator to use when creating dimensions whose unit format is decimal.
   *
   * It's represented in ASCII code
   *
   * Parsed by group code `278`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-0CDD6AA6-CDD8-4C9D-A270-A3DA00DCE63E
   */
  DIMDSEP: number
  /**
   * Sets dimension text movement rules.
   *
   * Parsed by group code `279`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-10475059-6A2E-40B2-AF30-E92F104E9C03
   */
  DIMTMOVE: number
  /**
   * Controls the horizontal positioning of dimension text.
   *
   * Parsed by group code `280`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-C67348A9-2260-4135-A7FF-FE0B45211CB0
   */
  DIMJUST: DimensionTextHorizontal
  /**
   * Controls suppression of the first dimension line and arrowhead.
   *
   * When turned on, suppresses the display of the dimension line and arrowhead between the first
   * extension line and the text.
   *
   * - `0` First dimension line is not suppressed
   * - `1` First dimension line is suppressed
   *
   * Parsed by group code `281`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-B476440D-0BCB-4691-81BA-1B0DC945BE99
   */
  DIMSD1: 0 | 1
  /**
   * Controls suppression of the second dimension line and arrowhead.
   *
   * When turned on, suppresses the display of the dimension line and arrowhead between the second
   * extension line and the text.
   *
   * - `0` Second dimension line is not suppressed
   * - `1` Second dimension line is suppressed
   *
   * Parsed by group code `282`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-B55002A4-AF9F-41D0-A8B4-EDB8BB078662
   */
  DIMSD2: 0 | 1
  /**
   * Sets the vertical justification for tolerance values relative to the nominal dimension text.
   *
   * This system variable has no effect unless `DIMTOL` is set to On.
   *
   * Parsed by group code `283`
   *
   * The default for `DIMTOL` is Off.
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-CF5FAF97-2718-4253-8B4C-9D6D7EB75C59
   */
  DIMTOLJ: DimensionTextVertical
  /**
   * Controls the suppression of zeros in tolerance values.
   *
   * Values `0` ~ `3` affect feet-and-inch dimensions only.
   *
   * Parsed by group code `284`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-944FA6CB-1394-4523-9620-6B1350F0C40E
   */
  DIMTZIN: DimensionZeroSuppression
  /**
   * Controls the suppression of zeros for alternate unit dimension values.
   *
   * `DIMALTZ` values `0` ~ `3` affect feet-and-inch dimensions only.
   *
   * Parsedby group code `285`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-4EAEEC60-4A34-4C5E-BFA4-AEFA8EEB4FB6
   */
  DIMALTZ: DimensionZeroSuppression
  /**
   * Controls suppression of zeros in tolerance values.
   *
   * Parsed by group code `286`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-846F1DD5-C6B0-4088-BD5D-51D5E62345E2
   */
  DIMALTTZ: DimensionZeroSuppression
  /**
   * Obsolete. Use `DIMAFIT` and `DIMTMOVE` instead.
   *
   * Parsed by group code `287`
   *
   * @see https://help.autodesk.com/view/OARX/2024/ENU/?guid=OARX-RefGuide-AcDbDimension__dimfit
   */
  DIMFIT?: number
  /**
   * Controls options for user-positioned text.
   *
   * - `0` Cursor controls only the dimension line location
   * - `1` Cursor controls both the text position and the dimension line location
   *
   * Parsed by group code `288`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-4B271261-0596-48DE-BA45-0AB0C7379FA4
   */
  DIMUPT: number
  /**
   * Determines how dimension text and arrows are arranged when space is not sufficient to place both within the extension lines.
   *
   * Parsed by group code `289`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-2F8FA7E7-C79F-40EA-A416-C4B02D09F310
   */
  DIMATFIT: number
  /**
   * Controls whether extension lines are set to a fixed length.
   *
   * When DIMFXLON is on (`1`), extension lines are set to the length specified by `DIMFXL`.
   *
   * Parsed by group code `290`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-D0E2EA4A-4CA2-4286-9439-55A19726C166
   */
  DIMFXLON: 0 | 1
  /**
   * Specifies the reading direction of the dimension text.
   *
   * - `0`: Displays dimension text in a Left-to-Right reading style
   * - `1`: Displays dimension text in a Right-to-Left reading style
   *
   * Parsed by group code `294`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-06B9BE91-A2E9-45CB-9B3D-7D5BDD238F5B
   */
  DIMTXTDIRECTION: number
  /**
   * Specifies the text style of the dimension.
   *
   * Parsed by group code `340`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-2B91DF02-DF27-447D-A395-054814B1F305
   */
  DIMTXSTY: string
  /**
   * Sets the arrowhead block displayed at the ends of dimension lines.
   *
   * There are pre-defined block names for AutoCAD. For more information, checkout the link in the below.
   * Be aware that the block names are **case insensitive**.
   *
   * Parsed by group code `342`
   *
   * @note Annotative blocks cannot be used as custom arrowheads for dimensions or leaders.
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-6E09DCCA-313F-4FF4-BB1B-F41B512B9CC9
   */
  DIMBLK: string
  /**
   * Sets the arrowhead for the first end of the dimension line when `DIMSAH` is on.
   *
   * For a list of arrowheads, see `DIMBLK`.
   *
   * Parsed by group code `343`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-9DCC9697-9B2C-4EF7-9728-FE047DE760B3
   */
  DIMBLK1: string
  /**
   * Sets the arrowhead for the second end of the dimension line when `DIMSAH` is on.
   *
   * For a list of arrowheads, see `DIMBLK`.
   *
   * Parsed by group code `344`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-E81E370B-55A6-49C5-A280-5F54EAF8308B
   */
  DIMBLK2: string
  /**
   * Specifies the arrow type for leaders.
   *
   * For a list of arrowhead entries, see `DIMBLK`.
   *
   * Parsed by group code `341`
   *
   * @Note Annotative blocks cannot be used as custom arrowheads for dimensions or leaders.
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-B4374832-C2B4-4555-900C-693625AC58DE
   */
  DIMLDRBLK?: string
  /**
   * Sets the linetype of the dimension line. The value is `BYLAYER`, `BYBLOCK`, or the name of a linetype.
   *
   * Parsed by group code `345`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-08054AEC-6DB4-4E69-B992-C6D8FC0021EC
   */
  DIMLTYPE: string
  /**
   * Sets the linetype of the first extension line. The value is `BYLAYER`, `BYBLOCK`, or the name of a linetype.
   *
   * Parsed by group code `346`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-535BAECA-312A-4841-A064-4FDB3469AAD0
   */
  DIMLTEX1: string
  /**
   * Sets the linetype of the second extension line. The value is `BYLAYER`, `BYBLOCK`,
   * or the name of a linetype.
   *
   * Parsed by group code `347`
   *
   * @see https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-E2101E66-6741-40BF-B62D-E8201F51BA7F
   */
  DIMLTEX2: string
  /**
   * Assigns lineweight to dimension lines.
   *
   * - `-1` Sets the lineweight to `BYLAYER`
   * - `-2` Sets the lineweight to `BYBLOCK`
   * - `-3` Sets the lineweight to `DEFAULT` which is controlled by the `LWDEFAULT` system variable.
   *
   * Other valid values entered in hundredths of millimeters include `0`, `5`, `9`, `13`, `15`, `18`,
   * `20`, `25`, `30`, `35`, `40`, `50`, `53`, `60`, `70`, `80`, `90`, `100`, `106`, `120`, `140`, `158`,
   * `200`, and `211`.
   *
   * All values must be entered in hundredths of millimeters. Multiply a value by `2540` to convert
   * values from inches to hundredths of millimeters.
   *
   * Parsed by group code `371`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-8EE72FFB-3EE7-4F10-83EC-45565F1CBCCE
   */
  DIMLWD: number
  /**
   * Assigns lineweight to extension lines.
   *
   * - `-1` Sets the lineweight to `BYLAYER`
   * - `-2` Sets the lineweight to `BYBLOCK`
   * - `-3` Sets the lineweight to `DEFAULT` which is controlled by the `LWDEFAULT` system variable.
   *
   * Other valid values entered in hundredths of millimeters include `0`, `5`, `9`, `13`, `15`, `18`,
   * `20`, `25`, `30`, `35`, `40`, `50`, `53`, `60`, `70`, `80`, `90`, `100`, `106`, `120`, `140`, `158`,
   * `200`, and `211`.
   *
   * All values must be entered in hundredths of millimeters. Multiply a value by `2540` to convert
   * values from inches to hundredths of millimeters.
   *
   * Parsed by group code `372`
   *
   * @see https://help.autodesk.com/view/ACD/2024/ENU/?guid=GUID-21DF5F82-4F3A-4F93-8FD6-89A942799468
   */
  DIMLWE: number
}

export type DimStylesTableEntry = DimStyleVariables &
  CommonDxfTableEntry & {
    name: string
    subclassMarker: 'AcDbDimStyleTableRecord'
  }
