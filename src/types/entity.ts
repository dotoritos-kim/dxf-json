import type { Matrix3 } from 'three';

export interface CommonEntityDecomposeOption {
    layer?: string;
    color: number;
    extrusionTransform?: Matrix3;
}
