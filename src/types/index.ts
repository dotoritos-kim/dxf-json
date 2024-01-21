export * from './color';
export * from './dxfHeader';

export interface Point2D {
    x: number;
    y: number;
}

export interface Point3D {
    x: number;
    y: number;
    z: number;
}

export interface Bound {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;

export type Indexed<T, P extends string> = {
    [key in P]: T;
} & {
    index: number;
};
