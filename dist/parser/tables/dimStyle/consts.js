"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DimStyleVariablesSchema = void 0;
const consts_1 = require("../../../consts");
exports.DimStyleVariablesSchema = [
    // Prefix/suffix for primary units dimension values.
    {
        name: 'DIMPOST',
        code: 3,
    },
    // Prefix/suffix for alternate units dimensions.
    {
        name: 'DIMAPOST',
        code: 4,
    },
    {
        name: 'DIMBLK_OBSOLETE',
        code: 5,
    },
    {
        name: 'DIMBLK1_OBSOLETE',
        code: 6,
    },
    {
        name: 'DIMBLK2_OBSOLETE',
        code: 7,
    },
    // Global dimension feature scale factor
    {
        name: 'DIMSCALE',
        code: 40,
        defaultValue: 1,
    },
    // Dimension line and arrowhead size
    {
        name: 'DIMASZ',
        code: 41,
        defaultValue: 0.25,
    },
    // Distance from origin points to extension lines
    {
        name: 'DIMEXO',
        code: 42,
        defaultValue: 0.625,
        defaultValueImperial: 0.0625,
    },
    // Incremental spacing between baseline dimensions
    {
        name: 'DIMDLI',
        code: 43,
        defaultValue: 3.75,
        defaultValueImperial: 0.38,
    },
    // Extension line distance beyond dimension line
    {
        name: 'DIMEXE',
        code: 44,
        defaultValue: 2.25,
        defaultValueImperial: 0.28,
    },
    // Rounding value for decimal dimensions
    {
        name: 'DIMRND',
        code: 45,
        defaultValue: 0,
    },
    // Dimension line extension beyond extension lines
    {
        name: 'DIMDLE',
        code: 46,
        defaultValue: 0,
    },
    // Upper tolerance value for tolerance dimensions
    {
        name: 'DIMTP',
        code: 47,
        defaultValue: 0,
    },
    // Lower tolerance value for tolerance dimensions
    {
        name: 'DIMTM',
        code: 48,
        defaultValue: 0,
    },
    // Size of dimension text
    {
        name: 'DIMTXT',
        code: 140,
        defaultValue: 2.5,
        defaultValueImperial: 0.28,
    },
    // Controls placement of center marks or centerlines
    {
        name: 'DIMCEN',
        code: 141,
        defaultValue: 2.5,
        defaultValueImperial: 0.09,
    },
    // Controls size of dimension line tick marks drawn instead of arrowheads
    {
        name: 'DIMTSZ',
        code: 142,
        defaultValue: 0,
    },
    // Alternate units dimension scale factor
    {
        name: 'DIMALTF',
        code: 143,
        defaultValue: 25.4,
    },
    // Scale factor for linear dimension values
    {
        name: 'DIMLFAC',
        code: 144,
        defaultValue: 1,
    },
    // Vertical position of text above or below dimension line if dimtad is 0
    {
        name: 'DIMTVP',
        code: 145,
        defaultValue: 0,
    },
    // Scale factor for fractional or tolerance text size
    {
        name: 'DIMTFAC',
        code: 146,
        defaultValue: 1,
    },
    // Gap size between dimension line and dimension text
    {
        name: 'DIMGAP',
        code: 147,
        defaultValue: 0.625,
        defaultValueImperial: 0.09,
    },
    // Rounding value for alternate dimension units
    {
        name: 'DIMALTRND',
        code: 148,
        defaultValue: 0,
    },
    // Toggles creation of appended tolerance dimensions
    {
        name: 'DIMTOL',
        code: 71,
        defaultValue: 0,
        defaultValueImperial: 1,
    },
    // Toggles creation of limits-style dimension text
    {
        name: 'DIMLIM',
        code: 72,
        defaultValue: 0,
    },
    // Orientation of text inside extension lines
    {
        name: 'DIMTIH',
        code: 73,
        defaultValue: 0,
        defaultValueImperial: 1,
    },
    // Orientation of text outside extension lines
    {
        name: 'DIMTOH',
        code: 74,
        defaultValue: 0,
        defaultValueImperial: 1,
    },
    // Toggles suppression of first extension line
    {
        name: 'DIMSE1',
        code: 75,
        defaultValue: 0,
    },
    // Toggles suppression of second extension line
    {
        name: 'DIMSE2',
        code: 76,
        defaultValue: 0,
    },
    // Sets vertical text placement relative to dimension line
    {
        name: 'DIMTAD',
        code: 77,
        defaultValue: consts_1.DimensionTextVertical.Above,
        defaultValueImperial: consts_1.DimensionTextVertical.Center,
    },
    // Zero suppression for primary units dimensions
    {
        name: 'DIMZIN',
        code: 78,
        defaultValue: consts_1.DimensionZeroSuppression.Trailing,
        defaultValueImperial: consts_1.DimensionZeroSuppression.Feet,
    },
    // Controls zero suppression for angular dimensions
    {
        name: 'DIMAZIN',
        code: 79,
        defaultValue: consts_1.DimensionZeroSuppressionAngular.None,
    },
    // Enables or disables alternate units dimensioning
    {
        name: 'DIMALT',
        code: 170,
        defaultValue: 0,
    },
    // Controls decimal places for alternate units dimensions
    {
        name: 'DIMALTD',
        code: 171,
        defaultValue: 3,
        defaultValueImperial: 2,
    },
    // Toggles forced dimension line creation
    {
        name: 'DIMTOFL',
        code: 172,
        defaultValue: 1,
        defaultValueImperial: 0,
    },
    // Toggles appearance of arrowhead blocks
    {
        name: 'DIMSAH',
        code: 173,
        defaultValue: 0,
    },
    // Toggles forced placement of text between extension lines
    {
        name: 'DIMTIX',
        code: 174,
        defaultValue: 0,
    },
    // Suppresses dimension lines outside extension lines
    {
        name: 'DIMSOXD',
        code: 175,
        defaultValue: 0,
    },
    // Dimension line, arrowhead, and leader line color
    {
        name: 'DIMCLRD',
        code: 176,
        defaultValue: 0,
    },
    // Dimension extension line color
    {
        name: 'DIMCLRE',
        code: 177,
        defaultValue: 0,
    },
    // Dimension text color
    {
        name: 'DIMCLRT',
        code: 178,
        defaultValue: 0,
    },
    // Controls the number of decimal places for angular dimensions
    {
        name: 'DIMADEC',
        code: 179,
    },
    // Obsolete, now use DIMLUNIT AND DIMFRAC
    {
        name: 'DIMUNIT',
        code: 270,
    },
    // Decimal places for dimension values
    {
        name: 'DIMDEC',
        code: 271,
        defaultValue: 2,
        defaultValueImperial: 4,
    },
    // Decimal places for primary units tolerance values
    {
        name: 'DIMTDEC',
        code: 272,
        defaultValue: 2,
        defaultValueImperial: 4,
    },
    // Units format for alternate units dimensions
    {
        name: 'DIMALTU',
        code: 273,
        defaultValue: 2,
    },
    // Decimal places for alternate units tolerance values
    {
        name: 'DIMALTTD',
        code: 274,
        defaultValue: 2,
        defaultValueImperial: 4,
    },
    // Unit format for angular dimension values
    {
        name: 'DIMAUNIT',
        code: 275,
        defaultValue: 0,
    },
    // Controls the fraction format used for architectural and fractional dimensions
    {
        name: 'DIMFRAC',
        code: 276,
        defaultValue: 0,
    },
    // Specifies units for all nonangular dimensions
    {
        name: 'DIMLUNIT',
        code: 277,
        defaultValue: 2,
    },
    // Specifies a single character to use as a decimal separator
    {
        name: 'DIMDSEP',
        code: 278,
        defaultValue: ',',
        defaultValueImperial: '.',
    },
    // Controls the format of dimension text when it is moved
    // 뷰어에는 필요없어서 주석처리
    // {
    //     name: 'DIMTMOVE',
    //     code: 279,
    //     defaultValue: 0,
    // },
    // Horizontal justification of dimension text
    {
        name: 'DIMJUST',
        code: 280,
        defaultValue: consts_1.DimensionTextHorizontal.Center,
    },
    // Toggles suppression of first dimension line
    {
        name: 'DIMSD1',
        code: 281,
        defaultValue: 0,
    },
    // Toggles suppression of second dimension line
    {
        name: 'DIMSD2',
        code: 282,
        defaultValue: 0,
    },
    // Vertical justification for dimension tolerance text
    {
        name: 'DIMTOLJ',
        code: 283,
        defaultValue: consts_1.DimensionToleranceTextVertical.Center,
    },
    // Zero suppression for tolerances values
    {
        name: 'DIMTZIN',
        code: 284,
        defaultValue: consts_1.DimensionZeroSuppression.Trailing,
        defaultValueImperial: consts_1.DimensionZeroSuppression.Feet,
    },
    // Zero suppression for alternate units dimension values
    {
        name: 'DIMALTZ',
        code: 285,
        defaultValue: consts_1.DimensionZeroSuppression.Trailing,
    },
    // Zero suppression for alternate units tolerance values
    {
        name: 'DIMALTTZ',
        code: 286,
        defaultValue: consts_1.DimensionZeroSuppression.Trailing,
    },
    // Obsolete, now use DIMATFIT and DIMTMOVE
    {
        name: 'DIMFIT',
        code: 287,
    },
    // Controls user placement of dimension line and text
    {
        name: 'DIMUPT',
        code: 288,
        defaultValue: 0,
    },
    // Controls placement of text and arrowheads when there is insufficient space between the extension lines
    {
        name: 'DIMATFIT',
        code: 289,
        defaultValue: 3,
    },
    // Text style used for dimension text by name
    {
        name: 'DIMTXSTY',
        code: 340,
    },
    // Specify arrowhead used for leaders by name
    {
        name: 'DIMLDRBLK',
        code: 341,
    },
    // Block type to use for both arrowheads, handle of referenced block
    {
        name: 'DIMBLK',
        code: 342,
    },
    // Block type to use for first arrowhead, handle of referenced block
    {
        name: 'DIMBLK1',
        code: 343,
    },
    // Block type to use for first arrowhead, handle of referenced block
    {
        name: 'DIMBLK2',
        code: 344,
    },
    // Lineweight value for dimension lines
    {
        name: 'DIMLWD',
        code: 371,
        defaultValue: -2,
    },
    // Lineweight value for extension lines
    {
        name: 'DIMLWD',
        code: 372,
        defaultValue: -2,
    },
];
//# sourceMappingURL=consts.js.map