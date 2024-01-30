export interface ScannerGroup {
    code: number;
    value: any;
}
/**
 * DxfArrayScanner
 *
 * Based off the AutoCad 2012 DXF Reference
 * http://images.autodesk.com/adsk/files/autocad_2012_pdf_dxf-reference_enu.pdf
 *
 * Reads through an array representing lines of a dxf file. Takes an array and
 * provides an easy interface to extract group code and value pairs.
 * @param data - an array where each element represents a line in the dxf file
 * @constructor
 */
export default class DxfArrayScanner {
    private _pointer;
    private _data;
    private _eof;
    lastReadGroup: ScannerGroup;
    constructor(data: string[]);
    next(): {
        code: number;
        value: string | number | boolean;
    };
    peek(): ScannerGroup;
    rewind(numberOfGroups?: number | undefined): void;
    /**
 * Returns true if there is another code/value pair (2 elements in the array).
 * @returns {boolean}
 */
    hasNext(): boolean;
    /**
 * Returns true if the scanner is at the end of the array
 * @returns {boolean}
 */
    isEOF(): boolean;
}
