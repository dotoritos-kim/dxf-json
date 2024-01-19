import type { OrthographicType } from '../../consts';
import type { Point2D, Point3D } from '../../types';
import {
    DXFParserSnippet,
    Identity,
    PointParser,
} from '../shared/parserGenerator';
import { PlotSettingDXFObject, PlotSettingsSnippets } from './plotSettings';

// Snippet이 code별로 스택에 들어가기 때문에 일부로 역순으로 적음
export const LayoutSnippets: DXFParserSnippet[] = [
    {
        code: 333,
        name: 'shadePlotId',
        parser: Identity,
    },
    {
        code: 346,
        name: 'orthographicUcsId',
        parser: Identity,
    },
    {
        code: 345,
        name: 'namedUcsId',
        parser: Identity,
    },
    {
        code: 331,
        name: 'viewportId',
        parser: Identity,
    },
    {
        code: 330,
        name: 'paperSpaceTableId',
        parser: Identity,
    },
    {
        code: 76,
        name: 'orthographicType',
        parser: Identity,
    },
    {
        code: 17,
        name: 'ucsYAxis',
        parser: PointParser,
    },
    {
        code: 16,
        name: 'ucsXAxis',
        parser: PointParser,
    },
    {
        code: 13,
        name: 'ucsOrigin',
        parser: PointParser,
    },
    {
        code: 146,
        name: 'elevation',
        parser: Identity,
    },
    {
        code: 15,
        name: 'maxExtent',
        parser: PointParser,
    },
    {
        code: 14,
        name: 'minExtent',
        parser: PointParser,
    },
    {
        code: 12,
        name: 'insertionBase',
        parser: PointParser,
    },
    {
        code: 11,
        name: 'maxLimit',
        parser: PointParser,
    },
    {
        code: 10,
        name: 'minLimit',
        parser: PointParser,
    },
    {
        code: 71,
        name: 'tabOrder',
        parser: Identity,
    },
    {
        code: 70,
        name: 'controlFlag',
        parser: Identity,
    },
    {
        code: 1,
        name: 'layoutName',
        parser: Identity,
    },
    {
        code: 100,
        name: 'subclassMarker',
        parser: Identity,
    },
    ...PlotSettingsSnippets,
];

export enum LayoutControlFlag {
    PSLTSCALE = 1,
    LIMCHECK = 2,
}

export interface LayoutDXFObject
    extends Omit<PlotSettingDXFObject, 'subclassMarker'> {
    subclassMarker: 'AcDbLayout';
    layoutName: string;
    controlFlag: LayoutControlFlag;
    tabOrder: number;
    minLimit: Point2D;
    maxLimit: Point2D;
    insertionPoint: Point3D;
    minExtent: Point3D;
    maxExtent: Point3D;
    elevation: number;
    ucsOrigin: Point3D;
    ucsXAxis: Point3D;
    ucsYAxis: Point3D;
    orthographicType: OrthographicType;
    paperSpaceTableId: string;
    viewportId: string;
    namedUcsId?: string;
    orthographicUcsId?: string;
    shadePlotId: string;
}
