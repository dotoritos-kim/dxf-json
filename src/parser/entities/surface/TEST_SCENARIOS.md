# SURFACE 계열 테스트 시나리오

대상: `SURFACE`, `PLANESURFACE`, `NURBSURFACE`, `EXTRUDEDSURFACE`, `SWEPTSURFACE`, `REVOLVEDSURFACE`, `LOFTEDSURFACE` 파서 (`parser.ts`).

구현 위치
- `parser.test.ts`: 실도면 조각(tc0, tc1) 기반 기본 테스트
- `parser.adversarial.test.ts`: 아래 시나리오 ID 와 1:1 대응 (`describe` 접두어 = 카테고리)
- `scripts/verify-surface.ts`: 실도면 회귀 (로컬 전용, `npx vite-node scripts/verify-surface.ts [경로]`, 기본 `D:\CADView_도면`, 없으면 skip)

공통 입력 형태: `0 <TYPE> / 5 핸들 / 330 소유자 / 100 AcDbEntity / 8 레이어 / 100 AcDbModelerGeometry / 70 버전 / 100 AcDbSurface / 71 u / 72 v / 100 AcDb<Sub>Surface / ...`. 모든 시나리오는 끝에 `0 ENDSEC`(또는 `0 LINE` 등)을 붙여 스캐너 위치를 함께 검증한다.

## N. 정상 (DXF 레퍼런스 전 그룹코드)

| ID | 입력 | 기대 결과 |
|---|---|---|
| N-01 | SURFACE 기본 (5,330,8,70,1,71,72) | 각 필드 매핑, 다음 그룹이 `0 ENDSEC` |
| N-02 | EXTRUDEDSURFACE 전 코드 (90,90+310×2,10/20/30,40×16,42~45,48,49,46×16,47×16,290,70,292~296,11/21/31) | 전 필드 일치, 310 결합 `AABBCCDD` |
| N-03 | SWEPTSURFACE (90/90/310 두 쌍, 40×16, 41×16, 스윕 옵션) | sweep/path 블롭·행렬 분리 |
| N-04 | REVOLVEDSURFACE (90,90+310,10,11,40,41,42×16,43~46,290,291) | 전 필드 일치 |
| N-05 | LOFTEDSURFACE (40×16, (90+310)×2, 70, 41~44, 290~296) | `entityData` 2개, 불리언 7개 |
| N-06 | PLANESURFACE (100 + 90) | `classId` |
| N-07 | NURBSURFACE (100 만) | 마커·isoline |
| N-08 | R2013+ 347, 290, 2, 350 | 머티리얼·GUID·히스토리 |
| N-09 | ACIS `3`,`3`,`1` 긴 문자열 | `data` 문자열, 임시 필드 `_code1text/_code3text` 제거 |

## D. 기본값 / 선택 코드 누락

| ID | 입력 | 기대 결과 |
|---|---|---|
| D-01 | AcDbSurface 이하 전부 없음 | 헤더 필드만, isoline 없음, 크래시 없음 |
| D-02 | 71/72 없음 | `subclassMarker` 만 |
| D-03 | 6개 서브타입 각각 서브클래스 본문 없음 | 타입 유지, ENDSEC 유지 |
| D-04 | 90 크기 다음 310 없음 | 데이터 `''`, 이후 10/20/30 정상 |
| D-05 | `0 SURFACE` 단독 | 엔티티 1개 |
| D-06 | `AcDbModelerGeometry` 마커 누락 | **현재 동작 문서화**: 마커는 값이 아닌 순서로 매칭되므로 `100 AcDbSurface` 가 ModelerGeometry 자리로 소비되고 isoline 유실. 다음 엔티티는 유지 |

## B. 경계값

| ID | 입력 | 기대 결과 |
|---|---|---|
| B-01 | `-1e308`, `1.79E+308`, `-0.0`, 음수 각도, `1e-300` | 그대로 숫자 변환 (`-0` 보존) |
| B-02 | 실수 코드에 `NaN`, `abc` | NaN, 크래시 없음 |
| B-03 | isoline `-1`, `2147483647` | 그대로 |
| B-04 | 레이어/GUID/ACIS 빈 문자열 | `''` |
| B-05 | 한글 레이어 + `\U+AC00` + 한글 ACIS | 크래시 없이 보존 |
| B-06 | 310 × 1000 청크 (254,000자) | 전부 결합, 이후 10/20/30 정상 |
| B-07 | 불리언 코드 290 에 `2` | **현재 동작 문서화**: `DxfArrayScanner` 가 `TypeError` 를 던짐(모든 엔티티 공통). B-07b `it.todo` 로 정책 미정 표시 |

## O. 순서 뒤섞임 / 중복

| ID | 입력 | 기대 결과 |
|---|---|---|
| O-01 | 72 → 71 순서 | 둘 다 매핑 |
| O-02 | 71 중복 후 72 | **현재 동작 문서화**: 첫 값 유지, 중복을 만난 지점에서 엔티티 파싱 종료(72 유실), 다음 엔티티 유지 |
| O-03 | 서브클래스 스칼라 뒤섞임 | 전부 매핑 |
| O-04 | AcDbSurface 이후 공통 코드 8 재등장 | 다음 엔티티 유지 |
| O-05 | 행렬 40 사이에 42 끼움 | 40 은 배열 누적, 42 매핑 |

## S. 구조 적대적

| ID | 입력 | 기대 결과 |
|---|---|---|
| S-01 | `0 SURFACE` 바로 다음 `0 LINE` | 2개 |
| S-02 | 310 연속 중 다음 엔티티 | 블롭 `AA`, LINE 유지 |
| S-03 | 끝부분 알 수 없는 코드(77, 450, 1234) | 필드 유지, LINE 유지 |
| S-03b | 중간 알 수 없는 코드 999 | **현재 동작 문서화**: 이후 필드 유실(파서 프레임워크 공통), 다음 엔티티 유지 |
| S-04 | 정수 코드에 `many`, `3.7` | 크래시 없음, LINE 유지 |
| S-05 | 102 리액터/확장딕셔너리 + 1001 XDATA | 소유자·isoline·xdata 유지 |
| S-06 | CRLF + 그룹코드 공백 패딩 (parseSync) | 정상 파싱 |
| S-07 | ENDSEC 없이 `0 EOF` (parseSync) | 엔티티 1개 |
| S-08 | 그룹코드 뒤 값 줄 없이 파일 끝 | 무한루프 없음, 예외가 나면 `Error` |
| S-09 | SURFACE 에 `AcDbRevolvedSurface` 마커 | 크래시 없음, LINE 유지 |

## M. 연속·혼합 / BLOCKS

| ID | 입력 | 기대 결과 |
|---|---|---|
| M-01 | 7개 서브타입 + LINE 연속 | 순서대로 8개, ENDSEC 유지 |
| M-02 | parseSync, BLOCKS 안 SURFACE + REVOLVEDSURFACE, ENTITIES 안 EXTRUDED + LINE | 블록/모델 공간 모두 정상 |
| M-03 | LINE / SURFACE / LINE | 3개 |

## R. 회귀

| ID | 입력 | 기대 결과 |
|---|---|---|
| R-01 | LINE 단독 vs SURFACE 뒤 LINE | 동일 객체 |
| R-02 | 3DSOLID 다음 SURFACE | 두 타입 유지 |
| R-03 | 같은 입력 두 번 파싱 | 결과 동일(파서 상태 누수 없음) |
| (기존) | 전체 `npm test` | 다른 엔티티 테스트 전부 통과 |

## T. 서브타입 특이 (7종, 310 결합, 행렬)

| ID | 입력 | 기대 결과 |
|---|---|---|
| T-01 | 행렬 42 가 3개뿐 | `[1,0,0]` (길이 검증 없음, 있는 만큼) |
| T-02 | 행렬 40 이 17개 | 길이 17 보존 |
| T-03 | SWEPT 두 블롭 | `AA` / `BB` 분리 |
| T-04 | LOFTED 블롭 0개 | `entityData` 없음 |
| T-05 | 70 이 AcDbSurface 앞/뒤 | `version` / `sweepAlignment` 구분 |
| T-06 | 290 이 AcDbSurface 앞/뒤 | `hasRevisionGuid` / `isSolid` 구분 |
| T-07 | 공통부 160+310 프록시 그래픽 | 서브클래스 블롭과 섞이지 않음 |

## P. 성능

| ID | 입력 | 기대 결과 |
|---|---|---|
| P-01 | 7개 서브타입 + LINE × 1000 (8000 엔티티) | 3초 이내, 개수 정확 |

## C. 완전성 보강 (2차 비평)

| ID | 입력 | 기대 결과 |
|---|---|---|
| C-01 | 310 청크가 `0012`,`3400` (숫자처럼 보임) | 문자열 `00123400`, 선행 0 보존 |
| C-02 | 블롭 크기 90=0, 310 없음 | `sweepEntityData === ''`, 이후 10 유지 |
| C-03 | LOFTED 블롭 중 310 없는 항목 | `{size:0,data:''}` 포함, 순서 보존 |
| C-04 | 1/3 데이터가 숫자 문자열 | `data` 는 문자열, `_code1text`/`_code3text` 제거 |
| C-05 | 350 히스토리, 2 GUID, 290=1 | guid/hasRevisionGuid/version 정확값 |
| C-06 | 헤더에 102 `{ACAD_REACTORS` 그룹 | 본문 필드·다음 ENDSEC 유지 |
| C-07 | 끝에 XDATA 1001/1000 | 다음 LINE 유실 없음 |
| C-08 | isoline 71=-1, 72=2.5 | -1 보존, 2.5 는 정수 코드라 2 로 절삭(스캐너 동작) |

## 실도면 (scripts/verify-surface.ts)

- 경로 아래 ASCII `.dxf` 를 재귀 탐색, SURFACE 계열 `0 <TYPE>` 이 있는 파일만 대상.
- 원문 개수 vs 파싱 개수(ENTITIES + BLOCKS) 비교, 불일치 시 `MISMATCH`.
- 이상치: 핸들 없음, AcDbSurface 누락, isoline 음수/비정수, 행렬 길이 ≠ 16, 숫자 필드 NaN/Infinity, 블롭 길이 ≠ 크기×2.
- 경로가 없거나 대상 파일이 없으면 `[skip]` 후 종료 코드 0.

## 발견 사항 요약

SURFACE 파서 고유의 명백한 버그는 발견되지 않았다. 다음은 공통 프레임워크/스캐너 동작이라 수정하지 않고 테스트로 문서화했다.

1. 불리언 코드(290~299)에 0/1 외 값 → `DxfArrayScanner` 가 `TypeError` 를 던져 파일 전체 파싱 실패 (B-07, todo B-07b).
2. 중복 스칼라 코드·중간의 알 수 없는 코드 → 그 지점에서 해당 엔티티 파싱 종료, 이후 필드 유실. 다음 엔티티는 잃지 않음 (O-02, S-03b).
3. 서브클래스 마커(100)는 값이 아니라 순서로 매칭 → `AcDbModelerGeometry` 누락 시 isoline 유실 (D-06).
5. 정수 코드(71/72 등)의 소수 값은 스캐너가 정수로 절삭 (C-08).
4. 행렬(16개) 개수 검증 없음 → 부족/초과 모두 그대로 배열 (T-01, T-02).
