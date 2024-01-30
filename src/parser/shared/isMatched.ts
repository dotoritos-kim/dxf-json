import type { ScannerGroup } from "../DxfArrayScanner";

/**
 * group이 `code`와 `value`를 갖는지 확인
 * `value`가 `null`이나 `undefined`인 경우 아무거나 다 매칭한다고 가정한다.
 */

export function isMatched(group: ScannerGroup, code: number, value?: any) {
    return group.code === code && (value == null || group.value === value);
}
