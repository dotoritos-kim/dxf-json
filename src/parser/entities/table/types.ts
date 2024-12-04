import type { AttachmentPoint } from '../../../consts';
import type { Point3D } from '../../../types';
import type { CommonDxfEntity } from '../shared';

export interface TableCell {
    text: string;
    attachmentPoint: AttachmentPoint;
    textStyle?: string;
    rotation?: number;
    cellType: number;
    flagValue?: number;
    mergedValue?: number;
    autoFit?: number;
    borderWidth?: number;
    borderHeight?: number; // applicable for merged cells
    topBorderVisibility: boolean;
    bottomBorderVisibility: boolean;
    leftBorderVisibility: boolean;
    rightBorderVisibility: boolean;
    overrideFlag?: number;
    virtualEdgeFlag?: number;
    fieldObjetId?: string; // only for text type cell
    blockTableRecordId?: string;
    blockScale?: number;
    blockAttrNum?: number;
    attrDefineId?: string[];
    attrText?: string;
    textHeight: number;
    extendedCellFlags?: number; // from AutoCAD 2007
}

export interface TableEntity extends CommonDxfEntity {
    type: 'ACAD_TABLE';
    subclassMarker: 'AcDbTable';
    handle: string;
    ownerDictionaryId: string;
    name: string;
    version: number;
    startPoint: Point3D;
    directionVector: Point3D;
    attachmentPoint: AttachmentPoint;
    tableValue: number;
    rowCount: number;
    columnCount: number;
    overrideFlag?: number;
    borderColorOverrideFlag?: number;
    borderLineWeightOverrideFlag?: number;
    borderVisibilityOverrideFlag?: number;
    rowHeightArr: number[];
    columnWidthArr: number[];
    tableStyleId?: string;
    blockRecordHandle?: string;
    cells: TableCell[];
    bmpPreview: string;
}
