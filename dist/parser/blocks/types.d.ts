import type { Point3D } from '../../types';
import type { CommonDxfEntity } from '../entities/shared';
export interface DxfBlock {
    type: number;
    name: string;
    name2: string;
    handle: string;
    ownerHandle: string;
    layer: string;
    position: Point3D;
    paperSpace: boolean;
    xrefPath: string;
    entities?: CommonDxfEntity[];
}
