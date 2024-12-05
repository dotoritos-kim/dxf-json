export * from './isMatched'

let lastHandle = 0;

export function ensureHandle(entity: any) {
    if (!entity) {
        throw new TypeError('entity cannot be undefined or null');
    }

    if (!entity.handle) {
        entity.handle = lastHandle++;
    }
}