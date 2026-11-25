# MLEADERSTYLE 테스트 시나리오

대상: `src/parser/objects/mleaderStyle/parser.ts` (OBJECTS 섹션의 `0 / MLEADERSTYLE`).
구현: `parser.test.ts`(기본), `parser.adversarial.test.ts`(이 문서의 ID 와 테스트 이름 앞 ID 가 일치).
실도면 회귀: `npx vite-node scripts/verify-mleaderstyle.ts [경로...]` (기본 `D:\CADView_도면`, 없으면 skip).

파서 공통 동작(전제):

- 스니펫 기반 파서는 **모르는 그룹코드**나 **이미 소비한 코드의 중복**을 만나면 그 객체 파싱을 멈추고, `parseObjects` 가 다음 `0` 그룹까지 건너뛴다. 따라서 다음 객체는 잃지 않지만 같은 객체의 뒤쪽 필드는 유실된다.
- 값 타입은 스캐너(`parseGroupValue`)가 그룹코드 범위로 결정한다. 실수 → `parseFloat`, 정수 → `parseInt`, 290–299 → 엄격한 boolean(`0`/`1` 외에는 `TypeError`).
- 문자열은 줄 끝 `\r` 만 제거하고 트림하지 않으며 `\U+XXXX`, `\P` 등 MText 이스케이프는 디코딩하지 않는다.

## N. 정상

| ID | 입력 | 기대 결과 |
|---|---|---|
| N-01 | DXF 레퍼런스 AcDbMLeaderStyle 전 그룹코드(179,170–178,90–94,40–49,140–143,290–298,3,300,340–343,271–273) | 모든 필드가 이름·타입대로 채워지고 여분 키 없음(`toEqual`) |
| N-02 | N-01 을 완전한 DXF 로 감싸 `DxfParser.parseSync` | N-01 과 동일 |
| N-03 | N-01 | 정수 코드는 정수, 실수 코드는 number, 29x 는 boolean, 핸들은 문자열 |

## D. 기본값 / 선택 코드 누락

| ID | 입력 | 기대 결과 |
|---|---|---|
| D-01 | 5/330/100 만 | name, handle, ownerObjectId, subclassMarker 만 있음 |
| D-02 | `0 MLEADERSTYLE` 직후 ENDSEC | 결과에 포함되지 않음(읽은 그룹 없음) |
| D-03 | 340/341/343 누락 | 해당 필드 undefined, 나머지 정상 |
| D-04 | 47, 140 만 | `blockContentScale = {x, z}` (y 없음) |
| D-05 | 헤더만 | 기본값을 주입하지 않음(`scale` 키 없음) |
| D-06 | 5/100 없이 3 만 | description 만 파싱 |

## B. 경계값

| ID | 입력 | 기대 결과 |
|---|---|---|
| B-01 | 0 값 | 0 그대로 |
| B-02 | 음수 높이/스케일/개수/색 | 검증 없이 보존 |
| B-03 | `1e308`, `1.797…E+308`, ±2^31 경계 | 정확히 보존 |
| B-04 | `1e999` | `Infinity` |
| B-05 | `1.5E-3`, `2e+2`, `-3.0e1` | 지수 표기 해석 |
| B-06 | 실수/정수 자리에 `abc`, 빈 문자열 | `NaN`, 크래시 없음 |
| B-07 | `NaN` 문자열 | `NaN` |
| B-08 | 정수 코드에 `2.9`, `1e3` | `parseInt` 절삭(2, 1) — 현재 동작 |
| B-09 | 3/300/342 빈 문자열 | `''` |
| B-10 | 한글·한자·이모지, `\P` | 원문 그대로 |
| B-11 | `\U+D55C\U+AE00` | 디코딩하지 않고 원문 보존 |
| B-12 | 앞뒤 공백 문자열 | 트림하지 않음 |
| B-13 | 290=`2`, 296=`true` | throw 하지 않고 true (#189 스캐너 parseBoolean 수정) |
| B-14 | 290=` 1 ` | 공백 허용, true |

## O. 순서 뒤섞임 / 중복

| ID | 입력 | 기대 결과 |
|---|---|---|
| O-01 | 본문 코드 역순 | N-01 과 동일 |
| O-02 | 5/330/100 이 본문 뒤 | 정상 파싱 |
| O-03 | 3 이 두 번, 그 뒤 45 | 첫 값 유지, 뒤 필드(45) 유실 — 현재 동작 |
| O-04 | 중복 후 다음 MLEADERSTYLE | 다음 객체 정상 |
| O-05 | (todo) | 중복 코드 last-wins 여부는 스펙 미정의 → `it.todo` |

## S. 구조 적대적

| ID | 입력 | 기대 결과 |
|---|---|---|
| S-01 | 필드 몇 개 후 바로 ENDSEC | 읽은 필드까지 파싱 |
| S-02 | EOF 그룹 없이 입력 종료 | `Unexpected end of input` 명시적 오류 — 현재 동작 |
| S-03 | 값 줄 없는 홀수 라인 | 명시적 오류(크래시 아님) |
| S-04 | 객체 직후 `0 EOF`(ENDSEC 없음), `parseObjects` 직접 | 객체 파싱 후 정상 종료 (**버그 수정**) |
| S-04b | S-04 를 `parseSync` 로 | 동일 |
| S-05 | MLEADERSTYLE 사이에 MLINESTYLE/DICTIONARY, 빈 MLEADERSTYLE | 모든 객체 유지 |
| S-06 | 중간에 모르는 코드 999 | 앞 필드 유지, 뒤 필드 유실 — 현재 동작 |
| S-07 | 모르는 코드 뒤 다음 객체 | 다음 객체 유지 |
| S-08 | (todo) | 모르는 코드를 건너뛰고 계속할지 — 전 객체 공통 정책 결정 필요 |
| S-09 | 340 에 숫자, 174 에 문자열 | `'12345'`, `NaN` |
| S-10 | XDATA 2개 앱, 1000/1040/1070 | `xdata` 배열에 앱별로 |
| S-11 | XDATA 뒤 다음 객체 | 유지 |
| S-12 | `{ACAD_XDICTIONARY`, `{ACAD_REACTORS`(2개), 소유자 330 | `extensions` 및 `ownerObjectId` 분리 |
| S-13 | CRLF, 코드/숫자 앞뒤 공백 | 정상 파싱 |
| S-14 | BOM 시작 | 정상 파싱 |
| S-15 | 소문자 `mleaderstyle` | 무시(대소문자 구분) |

## M. 연속 / 혼합 / BLOCKS

| ID | 입력 | 기대 결과 |
|---|---|---|
| M-01 | Standard/Annotative/사용자 3개 연속 | 3개 순서대로 |
| M-02 | ACAD_MLEADERSTYLE DICTIONARY + 2개 | DICTIONARY 1, MLEADERSTYLE 2 |
| M-03 | BLOCKS(LINE 포함) + ENTITIES 안의 엉뚱한 `0 MLEADERSTYLE` + LINE + OBJECTS | 블록·엔티티 유지, OBJECTS 의 것만 수집 |
| M-04 | MULTILEADER(340=스타일 핸들) + MLEADERSTYLE | 핸들로 스타일 조회 가능 |

## R. 회귀

| ID | 입력 | 기대 결과 |
|---|---|---|
| R-01 | MLINESTYLE + 전체 MLEADERSTYLE + LAYOUT | 세 객체 모두 정상 |
| R-02 | MLEADERSTYLE 없는 도면 | `byName.MLEADERSTYLE` 없음 |
| R-03 | 같은 파서 인스턴스로 두 번 파싱 | 상태 누수 없음 |
| R-04 | `__proto__` 등 문자열 값 | 프로토타입 오염 없음 |

## F. 실도면 기반

| ID | 입력 | 기대 결과 |
|---|---|---|
| F-01 | AutoCAD 2018 기본 Standard/Annotative(리액터, 빈 341, XDATA ACAD_MLEADERVER), CRLF | 두 객체, annotative/xdata 정확 |
| F-02 | `scripts/verify-mleaderstyle.ts` 로 실도면 폴더 | 원문 개수 = 파싱 개수, 이상치(NaN, 타입, 음수 높이/스케일, 미지원 코드) 리포트. 경로 없으면 skip |

## P. 성능

| ID | 입력 | 기대 결과 |
|---|---|---|
| P-01 | 전체 필드 MLEADERSTYLE 5,000개 | 5,000개 모두, 10초 이내 |
| P-02 | 1M 글자 description | 길이 보존 |

## 발견 사항

1. **수정함**: `parseObjects` 가 객체 파싱 직후 `scanner.peek()` 를 호출해, OBJECTS 섹션이 `ENDSEC` 없이 `0 EOF` 로 끝나면 `Cannot call 'next' after EOF` 로 전체 파싱이 실패했다(S-04, S-04b). EOF 면 루프를 끝내도록 최소 수정.
2. **현재 동작 문서화(스펙 애매)**: 모르는 그룹코드·중복 그룹코드에서 해당 객체 파싱 중단(S-06, O-03, todo S-08/O-05). 정수 코드의 실수 값 절삭(B-08). 이스케이프 미디코딩(B-11).
3. **범위 밖(미수정)**: BLOCKS 의 `ENDBLK` 뒤에 `100 AcDbBlockEnd` 가 없으면(R12 형식 등) `parseBlock` 이 EOF 까지 소비해 이후 ENTITIES 등이 사라진다. MLEADERSTYLE 과 무관한 blocks 파서 문제라 별도 처리 필요. M-03 은 `AcDbBlockEnd` 를 넣어 테스트한다.

## C. 완전성 보강 (비평 단계에서 추가)

| ID | 입력 | 기대 결과 |
|---|---|---|
| C-01 | 레퍼런스 그룹코드를 하나씩 단독으로 넣은 객체 (44개) | 해당 필드 하나만 정확한 값으로 채워지고 다른 필드는 생기지 않음. 코드와 필드가 엇갈려 매핑되는 실수를 잡는다 (N-01 은 전체 일치만 봐서 값이 같은 필드끼리 바뀌어도 못 잡을 수 있음) |
| C-02 | FULL 에서 29x boolean 9개를 전부 반전 | 각 필드가 반전된 값. FULL 의 0/1 조합에 우연히 맞아 통과하는 경우 방지 |
| C-03 | 본문 뒤 XDATA 에 1000/1070 값 | description·defaultMTextContents·contentType 이 덮이지 않음 |
| C-04 | 102 리액터 그룹 뒤 3/340 | 102 그룹 처리 뒤에도 본문 필드가 정상 파싱 |

레퍼런스와 파서 코드 대조 결과: AcDbMLeaderStyle 그룹코드(170~179, 90~94, 40~49, 140~143, 290~298, 271~273, 3, 300, 340~343)는 모두 스니펫이 있다. 빠진 코드는 없다.
