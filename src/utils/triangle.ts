import { Vector2 } from 'three';

const ZeroVector = new Vector2();

// 끝점을 position을 가리키도록 설정
export function createTriangle(
    position: Vector2,
    angle: number,
    width: number,
    height: number,
): Vector2[] {
    return [
        position.clone(),
        position
            .clone()
            .add(
                new Vector2(-width, height / 2).rotateAround(ZeroVector, angle),
            ),
        position
            .clone()
            .add(
                new Vector2(-width, -height / 2).rotateAround(
                    ZeroVector,
                    angle,
                ),
            ),
    ];
}
