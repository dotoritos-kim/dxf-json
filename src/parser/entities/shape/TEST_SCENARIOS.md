# SHAPE 엔티티 테스트 시나리오

대상: `ShapeEntityParser` (`parser.ts`), `parseEntities` 디스패치, `DxfParser.parseSync`.
구현: `parser.test.ts`(기본 3건), `parser.adversarial.test.ts`(아래 ID 와 1:1), 실도면은 `scripts/verify-shape.ts`.

DXF 레퍼런스 그룹코드: 100(AcDbShape), 39 두께, 10/20/30 삽입점, 40 크기, 2 모양 이름, 50 회전(기본 0), 41 X 배율(기본 1), 51 기울기(기본 0), 210/220/230 돌출 방향(기본 0,0,1) + 공통 엔티티 코드(5, 330, 8, 6, 62, 370, 48, 60, 67, 410, 102 그룹, XDATA 1001~).

## N 정상
| ID | 입력 | 기대 결과 |
|---|---|---|
| N-01 | 레퍼런스 전 그룹코드 + 공통 코드 | 모든 필드 매핑, `isVisible`·`isInPaperSpace` 는 boolean, 스캐너는 EOF 위치 |
| N-02 | `tc0.partial_dxf` 픽스처 | ARROW, (100,200,0) |
| N-03 | 30 없는 2D 삽입점 | `{x,y}` 만, z 없음 |

## D 기본값·누락
| ID | 입력 | 기대 결과 |
|---|---|---|
| D-01 | 선택 코드 전부 누락 | 39=0, 50=0, 41=1, 51=0, 210=(0,0,1) |
| D-02 | 두 엔티티 기본값 | 돌출 벡터 객체가 서로 독립(공유 참조 없음) |
| D-03 | 10/40/2 누락 | 크래시 없음, 해당 필드 undefined, 기본값은 채워짐 |
| D-04 | `0 SHAPE` 바로 뒤 `0 LINE` | SHAPE(기본값만, handle 자동 생성) + LINE |
| D-05 | AcDbEntity 마커 없이 AcDbShape 만 | **현재 동작**: `subclassMarker` 미설정(첫 100 은 공통 스니펫이 소비). 다른 필드는 정상 |

## B 경계값
| ID | 입력 | 기대 결과 |
|---|---|---|
| B-01 | size `0`, `-0`, `-12.5`, `1e308`, `1.5E+3`, `2.5e-10`, 공백 패딩 | parseFloat 값 그대로 |
| B-02 | `1e309` | Infinity (현재 동작) |
| B-03 | 50 에 `NaN`/`abc`/빈 문자열 | NaN, 이후 코드 정상 |
| B-04 | 음수 회전/배율/두께, 720° 기울기 | 정규화 없이 보존 |
| B-05 | size 0, xScale 0 | 0 그대로 |
| B-06 | 빈 shapeName | `''` |
| B-07 | 한글, 유럽 문자, `\U+D55C` 이스케이프, 앞뒤 공백, 탭 | 원문 그대로 (이스케이프 디코딩 안 함, trim 안 함) |
| B-08 | 10만 자 이름 | 길이 유지 |
| B-09 | 돌출 영벡터 | (0,0,0) 보존 |

## O 순서·중복
| ID | 입력 | 기대 결과 |
|---|---|---|
| O-01 | 그룹 순서 뒤섞음 | 모든 필드 정상 매핑 |
| O-02 | 40 두 번 | **현재 동작**: 첫 값 유지 후 파싱 중단, 이후 필드(2) 유실, 스캐너는 중복 그룹에 되감김 |
| O-03 | 중복 후 LINE | parseEntities 가 다음 엔티티를 잃지 않음 |
| O-04 | 20 단독(10 없음) | 알 수 없는 코드로 처리, 크래시 없음, LINE 유지 |
| O-05 | 10 다음 30 (20 누락) | **현재 동작**: 공용 `parsePoint` 가 `Expected code for point value` 로 throw |
| O-06 | (todo) | 깨진 좌표에서 throw 대신 복구할지 — 모든 엔티티 공통 정책이라 SHAPE 단독 수정 안 함 |

## S 구조 적대적
| ID | 입력 | 기대 결과 |
|---|---|---|
| S-01 | 값 줄 없이 끝나는 잘린 파일 | throw 없음 |
| S-02 | `0 SHAPE` 직후 EOF | SHAPE 1개 |
| S-03 | `0 SHAPE` 연속 두 번 | SHAPE 2개 + LINE |
| S-04 | 중간에 999 등 모르는 코드 | **현재 동작**: 그 앞까지만 파싱, 이후 필드 유실, 다음 엔티티 유지 |
| S-05 | 좌표에 문자열 | NaN, 이후 코드 정상 |
| S-06 | 그룹코드 줄이 숫자 아님 | throw 없음, 다음 LINE 유지 |
| S-07 | XDATA(1001/1000/1040) | `xdata` 에 앱 이름, 앞 필드 정상 |
| S-08 | `{ACAD_REACTORS`·`{ACAD_XDICTIONARY` 그룹 | `extensions` 채워짐, 그룹 밖 330 이 소유자 |
| S-09 | CRLF + parseSync | SHAPE·LINE 모두 정상 |
| S-10 | 그룹코드/숫자 공백·탭 패딩 | 정상 파싱, 문자열(2)은 패딩 없는 경우 그대로 |
| S-11 | BOM 앞붙은 문서 | parseSync throw 없음 |

## M 연속·혼합·BLOCKS
| ID | 입력 | 기대 결과 |
|---|---|---|
| M-01 | SHAPE, LINE, SHAPE, SHAPE | 순서·핸들 유지, 기본값 누수 없음 |
| M-02 | BLOCKS 의 블록 안 SHAPE+LINE, ENTITIES 의 SHAPE | 블록 엔티티 2개, 최상위 1개 |
| M-03 | ENTITIES 에 SHAPE 하나 | parseSync 결과 1개 |

## R 회귀
| ID | 입력 | 기대 결과 |
|---|---|---|
| R-01 | SHAPE 뒤 LINE | LINE 에 SHAPE 필드 없음 |
| R-02 | 파서 인스턴스 재사용 | 이전 엔티티 값 누수 없음 |
| R-03 | SHAPE 뒤 TEXT(같은 코드 2/50 사용) | TEXT 정상, shapeName 없음 |

## P 성능
| ID | 입력 | 기대 결과 |
|---|---|---|
| P-01 | SHAPE 2만 개 parseSync | 전부 파싱, 10초 이내 |

## F 실도면 (`scripts/verify-shape.ts`)
| ID | 입력 | 기대 결과 |
|---|---|---|
| F-01 | `D:\CADView_도면`(또는 인자) 아래 SHAPE 포함 ASCII DXF | 원문 `0/SHAPE` 수 = 파싱 수(ENTITIES+BLOCKS) |
| F-02 | 같은 파일들 | 필드 이상치(NaN, size<=0, 빈 이름, xScale 0, 서브클래스 누락) 리포트 |
| F-03 | 경로 없음 | skip 메시지, 종료코드 0 |

실행: `npx vite-node ./scripts/verify-shape.ts [경로]`

## 발견 사항 요약
- SHAPE 전용 파서 버그는 발견되지 않았다.
- O-02 / S-04: 중복·미지 그룹코드에서 엔티티 파싱이 중단되어 뒤 필드가 사라진다. `createParser` 공통 동작이라 SHAPE 만 고치지 않고 현재 동작으로 문서화.
- O-05: 좌표 그룹이 깨지면 `parsePoint` 가 throw 해 `parseSync` 전체가 실패한다. 공통 정책 결정 필요(`test.todo` O-06).
- D-05: AcDbEntity 마커가 없으면 subclassMarker 가 비어 있다(R12 스타일 파일). 공통 스니펫 순서 문제로 문서화.
