import type { Point3D } from '../../../types';

/*
  https://help.autodesk.com/view/OARX/2023/ENU/?guid=GUID-A2A628B0-3699-4740-A215-C560E7242F63

  확장 데이터는 LISP 언어 형식으로 작성되는데, 대충 재귀적인 배열 구조라고 생각하면 된다.
  이 구조는 AutoCAD 혹은 서드파티가 알아서 정의하고 쓰므로 신경꺼도 좋다.
  (ex: [1, 2, 'babo', [3], 3.14, [[]]])

  각 깊이는 1002번 코드의 {로 시작하여 }로 끝난다.
  이 값들은 DXF 일반 코드와 다르게 이름이 있기도 하고 없기도 하여, 아래와 같은 자료 구조로 저장한다.
*/

export interface XData {
  appName: string;
  value: XDataEntry[];
}

export interface XDataEntry {
  name?: string;
  value: XDataEntry[] | number | string | Point3D;
}
