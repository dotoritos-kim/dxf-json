import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import * as helpers from '../../ParseHelpers';
import type { AttachmentPoint } from '../../../consts';
import { parsePoint } from '../../shared/parsePoint';
import { ensurePoint3D } from '../../../utils';
import type { TableEntity, TableCell } from './types';

export class TableEntityParser {
    static ForEntityName = 'ACAD_TABLE';

    parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
        const entity = {} as TableEntity;
        while (!scanner.isEOF()) {
            if (curr.code === 0) {
                scanner.rewind();
                break;
            }

            switch (curr.code) {
                case 100:
                    entity.subclassMarker = curr.value;
                    curr = scanner.next();
                    break;
                case 2:
                    entity.name = curr.value as string;
                    curr = scanner.next();
                    break;
                case 5:
                    entity.handle = curr.value as string;
                    curr = scanner.next();
                    break;
                case 10: // X coordinate of point
                    entity.startPoint = ensurePoint3D(parsePoint(scanner));
                    curr = scanner.lastReadGroup;
                    break;
                case 11:
                    entity.directionVector = ensurePoint3D(parsePoint(scanner));
                    curr = scanner.lastReadGroup;
                    break;
                case 90:
                    entity.tableValue = curr.value as number;
                    curr = scanner.next();
                    break;
                case 91:
                    entity.rowCount = curr.value as number;
                    curr = scanner.next();
                    break;
                case 92:
                    entity.columnCount = curr.value as number;
                    curr = scanner.next();
                    break;
                case 93:
                    entity.overrideFlag = curr.value as number;
                    curr = scanner.next();
                    break;
                case 94:
                    entity.borderColorOverrideFlag = curr.value as number;
                    curr = scanner.next();
                    break;
                case 95:
                    entity.borderLineWeightOverrideFlag = curr.value as number;
                    curr = scanner.next();
                    break;
                case 96:
                    entity.borderVisibilityOverrideFlag = curr.value as number;
                    curr = scanner.next();
                    break;
                case 141:
                    entity.rowHeightArr ??= [];
                    entity.rowHeightArr.push(curr.value as number);
                    curr = scanner.next();
                    break;
                case 142:
                    entity.columnWidthArr ??= [];
                    entity.columnWidthArr.push(curr.value as number)
                    curr = scanner.next();
                    break;
                case 280:
                    entity.version = curr.value as number;
                    curr = scanner.next();
                    break;
                case 310:
                    entity.bmpPreview ??= '';
                    entity.bmpPreview += curr.value as string;
                    curr = scanner.next();
                    break;
                case 330:
                    entity.ownerDictionaryId = curr.value as string;
                    curr = scanner.next();
                    break;
                case 342:
                    entity.tableStyleId = curr.value as string;
                    curr = scanner.next();
                    break;
                case 343:
                    entity.blockRecordHandle = curr.value as string;
                    curr = scanner.next();
                    break;
                case 170:
                    entity.attachmentPoint = curr.value as AttachmentPoint;
                    curr = scanner.next();
                    break;
                case 171:
                    entity.cells ??= [];
                    entity.cells.push(parserTableCell(scanner, curr));
                    curr = scanner.lastReadGroup;
                    break;
                default:
                    // console.log(curr.code, curr.value);
                    helpers.checkCommonEntityProperties(entity, curr, scanner);
                    curr = scanner.next();
                    break;
            }
        }
        return entity;
    }
}

function parserTableCell(scanner: DxfArrayScanner, curr: ScannerGroup): TableCell {
    let cellIsStarted = false;
    let cellIsFinished = false;

    const cell = {} as TableCell;
    while (!scanner.isEOF()) {
        if (curr.code === 0 || cellIsFinished) {
            break;
        }
        switch (curr.code) {
            case 171:
                if (cellIsStarted) {
                    cellIsFinished = true;
                    continue;
                }
                cell.cellType = curr.value as number;
                cellIsStarted = true;
                curr = scanner.next();
                break;
            case 172:
                cell.flagValue = curr.value as number;
                curr = scanner.next();
                break;
            case 173:
                cell.mergedValue = curr.value as number;
                curr = scanner.next();
                break;
            case 174:
                cell.autoFit = curr.value as number;
                curr = scanner.next();
                break;
            case 175:
                cell.borderWidth = curr.value as number;
                curr = scanner.next();
                break;
            case 176:
                cell.borderHeight = curr.value as number;
                curr = scanner.next();
                break;
            case 91:
                cell.overrideFlag = curr.value as number;
                curr = scanner.next();
                break;
            case 178:
                cell.virtualEdgeFlag = curr.value as number;
                curr = scanner.next();
                break;
            case 145:
                cell.rotation = curr.value as number;
                curr = scanner.next();
                break;
            case 345:
                cell.fieldObjetId = curr.value as string;
                curr = scanner.next();
                break;
            case 340:
                cell.blockTableRecordId = curr.value as string;
                curr = scanner.next();
                break;
            case 146:
                cell.blockScale = curr.value as number;
                curr = scanner.next();
                break;
            case 177:
                cell.blockAttrNum = curr.value as number;
                curr = scanner.next();
                break;
            case 7:
                cell.textStyle = curr.value as string;
                curr = scanner.next();
                break;
            case 140:
                cell.textHeight = curr.value as number;
                curr = scanner.next();
                break;
            case 170:
                cell.attachmentPoint = curr.value as number;
                curr = scanner.next();
                break;
            case 92:
                cell.extendedCellFlags = curr.value as number;
                curr = scanner.next();
                break;
            case 285:
                cell.rightBorderVisibility = !!(curr.value ?? true);
                curr = scanner.next();
                break;
            case 286:
                cell.bottomBorderVisibility = !!(curr.value ?? true);
                curr = scanner.next();
                break;
            case 288:
                cell.leftBorderVisibility = !!(curr.value ?? true);
                curr = scanner.next();
                break;
            case 289:
                cell.topBorderVisibility = !!(curr.value ?? true);
                curr = scanner.next();
                break;
            case 301:
                parserCellValue(cell, scanner, curr);
                curr = scanner.next();
                break;
            default:
                return cell;
        }
    }
    cellIsStarted = false;
    cellIsFinished = false;

    return cell;
}

function parserCellValue(cell: TableCell, scanner: DxfArrayScanner, curr: ScannerGroup) {
    while (curr.code !== 304) {
        switch (curr.code) {
            case 301:
                curr = scanner.next();
                break;
            case 93:
                curr = scanner.next();
                break;
            case 90:
                curr = scanner.next();
                break;
            case 1:
                cell.text = curr.value as string;
                curr = scanner.next();
                break;
            case 94:
                curr = scanner.next();
                break;
            case 300:
                cell.attrText = curr.value as string;
                curr = scanner.next();
                break;
            case 302:
                cell.text = curr.value ? (curr.value as string) : cell.text;
                curr = scanner.next();
                break;
            default:
                console.log(`Ignore code: ${curr.code}, value: ${curr.value}`);
                curr = scanner.next();
                break;
        }
    }
    return;
}
