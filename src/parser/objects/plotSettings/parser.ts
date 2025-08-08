import { DXFParserSnippet, Identity } from '../../shared/parserGenerator';
import { CommonObjectSnippets } from '../shared';

export const PlotSettingsSnippets: DXFParserSnippet[] = [
    {
        code: 333,
        name: 'shadePlotId',
        parser: Identity,
    },
    {
        code: 149,
        name: 'imageOriginY',
        parser: Identity,
    },
    {
        code: 148,
        name: 'imageOriginX',
        parser: Identity,
    },
    {
        code: 147,
        name: 'scaleFactor',
        parser: Identity,
    },
    {
        code: 78,
        name: 'shadePlotCustomDPI',
        parser: Identity,
    },
    {
        code: 77,
        name: 'shadePlotResolution',
        parser: Identity,
    },
    {
        code: 76,
        name: 'shadePlotMode',
        parser: Identity,
    },
    {
        code: 75,
        name: 'standardScaleType',
        parser: Identity,
    },
    {
        code: 7,
        name: 'currentStyleSheet',
        parser: Identity,
    },
    {
        code: 74,
        name: 'plotType',
        parser: Identity,
    },
    {
        code: 73,
        name: 'plotRotation',
        parser: Identity,
    },
    {
        code: 72,
        name: 'paperUnit',
        parser: Identity,
    },
    {
        code: 70,
        name: 'layoutFlag',
        parser: Identity,
    },
    {
        code: 143,
        name: 'printScaleDenominator',
        parser: Identity,
    },
    {
        code: 142,
        name: 'printScaleNominator',
        parser: Identity,
    },
    {
        code: 141,
        name: 'windowAreaYMax',
        parser: Identity,
    },
    {
        code: 140,
        name: 'windowAreaXMax',
        parser: Identity,
    },
    {
        code: 49,
        name: 'windowAreaYMin',
        parser: Identity,
    },
    {
        code: 48,
        name: 'windowAreaXMin',
        parser: Identity,
    },
    {
        code: 47,
        name: 'plotOriginY',
        parser: Identity,
    },
    {
        code: 46,
        name: 'plotOriginX',
        parser: Identity,
    },
    {
        code: 45,
        name: 'paperHeight',
        parser: Identity,
    },
    {
        code: 44,
        name: 'paperWidth',
        parser: Identity,
    },
    {
        code: 43,
        name: 'marginTop',
        parser: Identity,
    },
    {
        code: 42,
        name: 'marginRight',
        parser: Identity,
    },
    {
        code: 41,
        name: 'marginBottom',
        parser: Identity,
    },
    {
        code: 40,
        name: 'marginLeft',
        parser: Identity,
    },
    {
        code: 6,
        name: 'plotViewName',
        parser: Identity,
    },
    {
        code: 4,
        name: 'paperSize',
        parser: Identity,
    },
    {
        code: 2,
        name: 'configName',
        parser: Identity,
    },
    {
        code: 1,
        name: 'pageSetupName',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...CommonObjectSnippets
];
