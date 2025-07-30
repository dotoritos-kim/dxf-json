import * as helpers from '../../ParseHelpers';
import { parsePoint } from '../../shared/parsePoint';
import { ensurePoint3D } from '../../../utils';
import type { CommonDxfEntity } from '../shared';
import type { ViewportEntity } from './types';

export class ViewportParser {
    static ForEntityName = 'VIEWPORT';

    parseEntity(scanner: any, curr: any) {
        const entity = {} as ViewportEntity;

        while (curr !== 'EOF') {
            if (curr.code === 0) {
                scanner.rewind();
                return entity;
            }

            if (!parseViewport(entity, scanner, curr)) {
                helpers.checkCommonEntityProperties(entity as CommonDxfEntity, curr, scanner);
            }
            curr = scanner.next();
        }

        return entity;
    }
}

function parseViewport(entity: ViewportEntity, scanner: any, curr: any) {
    if (curr === 'EOF') return false;

    switch (curr.code) {
        case 0:
            return false;
        case 100:
            entity.subclassMarker = curr.value;
            break;
        case 10:
            entity.viewportCenter = ensurePoint3D(parsePoint(scanner));
            break;
        case 40:
            entity.width = curr.value;
            break;
        case 41:
            entity.height = curr.value;
            break;
        case 68:
            entity.status = curr.value;
            break;
        case 69:
            entity.viewportId = curr.value;
            break;
        case 12:
            entity.displayCenter = parsePoint(scanner);
            break;
        case 13:
            entity.snapBase = parsePoint(scanner);
            break;
        case 14:
            entity.snapSpacing = parsePoint(scanner);
            break;
        case 15:
            entity.gridSpacing = parsePoint(scanner);
            break;
        case 16:
            entity.viewDirection = ensurePoint3D(parsePoint(scanner));
            break;
        case 17:
            entity.targetPoint = ensurePoint3D(parsePoint(scanner));
            break;
        case 42:
            entity.perspectiveLensLength = curr.value;
            break;
        case 43:
            entity.frontClipZ = curr.value;
            break;
        case 44:
            entity.backClipZ = curr.value;
            break;
        case 45:
            entity.viewHeight = curr.value;
            break;
        case 50:
            entity.snapAngle = curr.value;
            break;
        case 51:
            entity.viewTwistAngle = curr.value;
            break;
        case 72:
            entity.circleZoomPercent = curr.value;
            break;
        case 331:
            entity.frozenLayerIds ??= [];
            entity.frozenLayerIds.push(curr.value);
            break;
        case 90:
            entity.statusBitFlags = curr.value;
            break;
        case 340:
            entity.clippingBoundaryId = curr.value;
            break;
        case 1:
            entity.sheetName = curr.value;
            break;
        case 281:
            entity.renderMode = curr.value;
            break;
        case 71:
            entity.ucsPerViewport = curr.value;
            break;
        case 110:
            entity.ucsOrigin = ensurePoint3D(parsePoint(scanner));
            break;
        case 111:
            entity.ucsXAxis = ensurePoint3D(parsePoint(scanner));
            break;
        case 112:
            entity.ucsYAxis = ensurePoint3D(parsePoint(scanner));
            break;
        case 345:
            entity.ucsId = curr.value;
            break;
        case 346:
            entity.ucsBaseId = curr.value;
            break;
        case 79:
            entity.orthographicType = curr.value;
            break;
        case 146:
            entity.elevation = curr.value;
            break;
        case 170:
            entity.shadePlotMode = curr.value;
            break;
        case 61:
            entity.majorGridFrequency = curr.value;
            break;
        case 332:
            entity.backgroundId = curr.value;
            break;
        case 333:
            entity.shadePlotId = curr.value;
            break;
        case 348:
            entity.visualStyleId = curr.value;
            break;
        case 292:
            entity.isDefaultLighting = !!curr.value;
            break;
        case 282:
            entity.defaultLightingType = curr.value;
            break;
        case 141:
            entity.brightness = curr.value;
            break;
        case 142:
            entity.contrast = curr.value;
            break;
        case 63: // 타입이 조금씩 다름 셋 중 하나로 표현된다는 뜻인듯
        case 421:
        case 431:
            entity.ambientLightColor = curr.value;
            break;
        case 361:
            entity.sunId = curr.value;
            break;
        case 335:
        case 343:
        case 344:
        case 91:
            entity.softPointer = curr.value;
            break;
    }
    return true;
}
