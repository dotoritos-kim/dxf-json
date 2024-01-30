import type { HatchAssociativity, HatchGradientColorFlag, HatchGradientFlag, HatchPatternType, HatchSolidFill, HatchStyle } from '../../../../consts/hatch';
import type { Point3D } from '../../../../types';
import type { CommonDxfEntity } from '../../shared';
import type { BoundaryPath } from './boundaryPath';
import type { HatchDefinitionLine } from './definitionLine';
interface HatchEntityBase extends CommonDxfEntity {
    type: 'HATCH';
    subclassMarker: 'AcDbHatch';
    elevationPoint: Point3D;
    extrusionDirection?: Point3D;
    patternName: string;
    solidFill: HatchSolidFill;
    patternFillColor: any;
    associativity: HatchAssociativity;
    numberOfBoundaryPaths: number;
    boundaryPaths: BoundaryPath[];
    hatchStyle: HatchStyle;
    patternType: HatchPatternType;
    patternAngle?: number;
    patternScale?: number;
    numberOfDefinitionLines: number;
    definitionLines: HatchDefinitionLine[];
    pixelSize: number;
    numberOfSeedPoints: number;
    offsetVector?: Point3D;
    seedPoints?: Point3D[];
    gradientFlag?: HatchGradientFlag;
}
export interface GradientHatchEntity extends HatchEntityBase {
    gradientFlag: HatchGradientFlag.Gradient;
    gradientColorFlag: HatchGradientColorFlag;
    numberOfColors: 0 | 2;
    gradientRotation?: number;
    gradientDefinition: number;
    colorTint?: number;
}
export type HatchEntity = GradientHatchEntity | HatchEntityBase;
export {};
