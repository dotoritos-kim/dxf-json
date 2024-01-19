import DxfArrayScanner, { ScannerGroup } from 'parser/DxfArrayScanner';
import { Point3D } from 'types';
import * as helpers from '../../ParseHelpers';
import { parsePoint } from '../../shared/parsePoint';
import { AlignedDimensionEntity, AngularDimensionEntity, DimensionEntity, DimensionEntityCommon, OrdinateDimensionEntity, RadialDiameterDimensionEntity } from './types';

/**
 * @returns Return `false` if curr is not related to common dimension group
 */
export function parseDimension(entity: DimensionEntity, curr: ScannerGroup, scanner: DxfArrayScanner) {
    switch (curr.code) {
        case 100:
            entity.subclassMarker = curr.value;
            break;
        case 280:
            entity.version = curr.value;
            break;
        case 2:
            entity.name = curr.value;
            break;
        case 10:
            entity.definitionPoint = parsePoint(scanner) as Point3D;
            break;
        case 11:
            entity.textPoint = parsePoint(scanner) as Point3D;
            break;
        case 12:
            // for aligned
            (entity as AlignedDimensionEntity).insertionPoint = parsePoint(scanner) as Point3D;
            break;
        case 13:
            // group 13 and 14 are subclass specific definition point
            // for further information, look dxf dimension specification
            (entity as AlignedDimensionEntity | AngularDimensionEntity | OrdinateDimensionEntity).subDefinitionPoint1 = parsePoint(scanner) as Point3D;
            break;
        case 14:
            (entity as AlignedDimensionEntity | AngularDimensionEntity | OrdinateDimensionEntity).subDefinitionPoint2 = parsePoint(scanner) as Point3D;
            break;
        case 15:
            // for angular, radial, diameter
            (entity as AngularDimensionEntity | RadialDiameterDimensionEntity).centerPoint = parsePoint(scanner) as Point3D;
            break;
        case 16:
            // for angular
            (entity as AngularDimensionEntity).arcPoint = parsePoint(scanner) as Point3D;
            break;
        case 70:
            entity.dimensionType = curr.value;
            break;
        case 71:
            entity.attachmentPoint = curr.value;
            break;
        case 72:
            entity.textLineSpacingStyle = curr.value;
            break;
        case 40:
            // for radial, diameter
            (entity as RadialDiameterDimensionEntity).leaderLength = curr.value;
            break;
        case 41:
            entity.textLineSpacingFactor = curr.value;
            break;
        case 42:
            entity.measurement = curr.value;
            break;
        case 1:
            // if value === null or "<>", measurement should be drawn as text instead
            // if value === "", text is suppressed.
            // otherwise text should be drawn as is.
            entity.text = curr.value;
            break;
        case 50:
            // for aligned
            (entity as AlignedDimensionEntity).rotationAngle = curr.value;
            break;
        case 52:
            // for aligned
            (entity as AlignedDimensionEntity).obliqueAngle = curr.value;
            break;
        case 53:
            entity.textRotation = curr.value;
            break;
        case 51:
            // This group value is the negative of the angle between the OCS X axis
            // and the UCS X axis. It is always in the XY plane of the OCS
            entity.ocsRotation = curr.value;
            break;
        case 210:
            entity.extrusionDirection = parsePoint(scanner) as Point3D;
            break;
        case 3:
            entity.styleName = curr.value;
            break;
        default:
            helpers.checkCommonEntityProperties(entity, curr, scanner);
            break;
    }
}
