# SEQEND 테스트 시나리오

대상: `src/parser/entities/seqend/parser.ts` (`SeqendEntityParser`) 와 이를 부르는 `parseEntities`, `DxfParser.parseSync`.
구현: `parser.test.ts`(기본 3건), `parser.adversarial.test.ts`(아래 ID 와 1:1), 실도면 회귀 `scripts/verify-seqend.ts`.

SEQEND 는 DXF 레퍼런스상 공통 엔티티 그룹만 가진다(5, 330, 100 AcDbEntity, 8, 6, 62, 370, 48, 60, 67, 410, 347, 92/160, 310, 420, 430, 440, 380, 390, 284, 102 블록, 1001 XDATA). 330 은 시퀀스를 가진 POLYLINE/INSERT 핸들이다.

공통 판정 기준: 크래시(throw)가 없고, SEQEND 다음 엔티티를 잃지 않는다.

## N. 정상

| ID | 입력 | 기대 결과 |
|---|---|---|
| N-01 | 5/330/100/8 | handle, ownerBlockRecordSoftId, layer 채워짐 |
| N-02 | 레퍼런스 공통 그룹 전부(67,410,8,6,347,62,370,48,60,92,420,430,440,380,390,284) | 각 필드가 정확한 타입/값으로 들어감(toEqual) |
| N-03 | `tc0.partial_dxf` 직접 파싱 | 필드 파싱 후 스캐너가 `0 EOF` 앞에서 멈춤 |
| N-04 | 100 두 번(AcDbEntity, AcDbSequenceEnd) | 두 번째 값이 subclassMarker |
| N-05 | R12 스타일(100 없음) | 5/8 정상 |

## D. 기본값·선택코드 누락

| ID | 입력 | 기대 결과 |
|---|---|---|
| D-01 | `0 SEQEND` 만 | 자동 handle(숫자 카운터), 다른 필드 없음, 다음 LINE 유지 |
| D-02 | 330 없음 | ownerBlockRecordSoftId 속성 없음 |
| D-03 | 선택 코드 없음 | 기본값을 주입하지 않음(lineTypeScale 등 undefined) |

## B. 경계값

| ID | 입력 | 기대 결과 |
|---|---|---|
| B-01 | 62/370/48/60/67 = 0 | 0 / false |
| B-02 | 음수 | 음수 그대로 |
| B-03 | `-1E+300`, 99999999999, 4294967295 | 그대로 |
| B-04 | 62 = `1e3` | parseInt 로 1 (현재 동작 문서화) |
| B-05 | 62=`abc`, 48=`NaN` | NaN 저장, 크래시 없음, 다음 엔티티 유지 |
| B-06 | 48=`Infinity` | Infinity |
| B-07 | 5/330/8 빈 문자열 | layer·owner 는 ''. handle '' 은 ensureHandle 이 자동 handle 로 덮음(현재 동작) |
| B-08 | 한글/이모지/`\U+B2E8` | 원문 그대로(디코딩 안 함) |
| B-09 | 10만자 layer | 길이 보존 |
| B-10 | handle `00aB`, owner `0001F` | 대소문자·선행 0 보존 |

## O. 순서 뒤섞임·중복

| ID | 입력 | 기대 결과 |
|---|---|---|
| O-01 | 그룹 역순 | 전부 파싱 |
| O-02 | 8 두 번 뒤 62 | 첫 값 유지. 중복 이후 그룹(62)은 버려짐. 다음 엔티티 유지 |
| O-03 | 5 두 번 | 첫 handle |
| O-04 | 100 세 번 | 앞 두 개 소비, 크래시 없음 |
| O-05 | (todo) | 중복/미지원 그룹 뒤 정상 그룹을 계속 읽어야 하는지 — 공통 파서 제너레이터 정책, 스펙 미정 |

## S. 구조 적대적

| ID | 입력 | 기대 결과 |
|---|---|---|
| S-01 | `0 SEQEND` 에서 입력 끝(EOF·ENDSEC 없음) | SEQEND 1개, 크래시 없음 |
| S-02 | 홀수 줄(코드만 있고 값 없음) | 앞 그룹까지 파싱 |
| S-03 | SEQEND 직후 `0 EOF` | 1개 |
| S-04 | `0 SEQEND` 바로 다음 다른 엔티티/SEQEND | 모두 인식 |
| S-05 | 미지원 코드 999, 1071 | 크래시 없음, 다음 엔티티 유지, 그 뒤 그룹(8)은 손실(현재 동작) |
| S-06 | 60=`x`, 67=`2`, 284=`z` | false / true / NaN, 다음 엔티티 유지 |
| S-07 | XDATA 두 앱 | xdata 배열 2개 |
| S-08 | ACAD_REACTORS + ACAD_XDICTIONARY + 이후 330 | extensions 두 키, owner 는 블록 밖 330 |
| S-09 | 닫히지 않은 102 | throw 없음 |
| S-10 | CRLF (parseSync) | 정상 |
| S-11 | 코드 공백 패딩 `  8`, `330 ` | 정상 |
| S-12 | 값 공백 `  A  ` | 문자열 값은 공백 보존 |
| S-13 | `seqend` 소문자 | 미지원 엔티티로 건너뜀, 다음 LINE 유지 |
| S-14 | `__proto__` 값 | 단순 문자열, 프로토타입 오염 없음 |

## C. 연속·혼합·BLOCKS

| ID | 입력 | 기대 결과 |
|---|---|---|
| C-01 | POLYLINE→SEQEND→INSERT→ATTRIB×2→SEQEND→LINE | 순서·owner 정확 |
| C-02 | SEQEND 100개 연속 | 100개 모두, handle 순서 보존 |
| C-03 | BLOCK 안 POLYLINE+SEQEND, ENDBLK (parseSync) | 블록 엔티티에 들어가고 ENTITIES 섹션은 영향 없음 |
| C-04 | ENDBLK 바로 앞 필드 없는 SEQEND, 다음 BLOCK | 두 블록 모두 정상 |
| C-05 | INSERT/ATTRIB/SEQEND/LINE (parseSync) | 4개 |

## P. 시퀀스 짝 불일치

| ID | 입력 | 기대 결과 |
|---|---|---|
| P-01 | 앞에 POLYLINE/INSERT 없는 SEQEND | 독립 엔티티로 보존, owner 값 그대로 |
| P-02 | POLYLINE 뒤 SEQEND 누락 | 다음 엔티티에서 vertex 종료 |
| P-03 | VERTEX 0개 + SEQEND | vertices [] |
| P-04 | INSERT(66=1) 뒤 ATTRIB 없이 SEQEND | 정상 |
| P-05 | ATTRIB 뒤 SEQEND 누락 | 정상 |
| P-06 | SEQEND 두 번 | 둘 다 엔티티 |
| P-07 | SEQEND 뒤 고아 VERTEX | POLYLINE vertex 수 불변, 다음 LINE 유지 |
| P-08 | 330 이 실제 부모와 불일치 | 검증 없이 보존 |

## R. 회귀

| ID | 입력 | 기대 결과 |
|---|---|---|
| R-01 | LINE/SEQEND(62, XDATA)/LINE | 앞뒤 LINE 에 필드 누수 없음 |
| R-02 | 파서 인스턴스 재사용 | 이전 결과가 새지 않음 |
| R-03 | SEQEND 있음/없음 POLYLINE | vertices 동일 |

## F. 성능

| ID | 입력 | 기대 결과 |
|---|---|---|
| F-01 | POLYLINE+VERTEX×3+SEQEND 2만 세트 | 4만 엔티티, 2초 이내 |

## RW. 실도면

| ID | 입력 | 기대 결과 |
|---|---|---|
| RW-01 | `D:\CADView_도면`(또는 `SEQEND_DXF_ROOT`) 아래 SEQEND 를 포함한 첫 .dxf | 원문 `0/SEQEND` 개수 = 파싱 개수(엔티티+블록), handle 문자열. 폴더 없으면 skip |
| RW-02 | `npx vite-node scripts/verify-seqend.ts [경로]` | 전 파일 개수 비교·이상치(handle 자동부여, owner/layer 없음, 비유한 숫자) 리포트 |

## G. 완전성 보강 (parser.gaps.test.ts)

| ID | 입력 | 기대 결과 |
|---|---|---|
| G-01 | 92 + 310 청크 3개 | proxyEntity 는 청크를 순서대로 이은 문자열, proxyByte=4 |
| G-02 | 160 123456 | proxyByte=123456 |
| G-03 | 사용자 앱 `102 {MYAPP ... 102 }` | extensions.MYAPP 에 그룹 보존, 뒤 330/8 계속 파싱 |
| G-04 | handle 없는 SEQEND 2개 | 비어 있지 않고 서로 다른 자동 handle (D-01 보강) |
| G-05 | 닫히지 않은 `102 {ACAD_REACTORS` 뒤 LINE | SEQEND·LINE 둘 다 남음 (S-09 보강, 버그 수정) |
| G-06 | SEQEND 에 10/20/30 | 기하 필드로 흘러들지 않음, 다음 LINE 보존 |
| G-07 | 레이어·102 앱 이름·1001 앱 이름이 `__proto__` | 크래시·프로토타입 오염 없음 (버그 수정) |

## X. 범위 밖으로 기록

| ID | 내용 |
|---|---|
| X-01 | (todo) R12 형식 `ENDBLK` 에 `100 AcDbBlockEnd` 가 없으면 BLOCKS 파서가 그 뒤 블록·섹션을 소비함. SEQEND 가 아닌 BLOCKS 파서 문제라 이 브랜치에서 고치지 않음 |

## 발견 사항 정리

- SEQEND 파서 자체의 명백한 버그는 발견되지 않음(수정 없음).
- 현재 동작으로 문서화한 것: 중복·미지원 그룹 이후 그룹 손실(O-02, S-05, 공통 파서 제너레이터 동작), 정수 코드의 지수 표기 절삭(B-04), 빈 handle 자동 교체(B-07), `\U+` 미디코딩(B-08).
- (보강 단계에서 수정) 공통 확장 파서 `src/parser/shared/extensions/parser.ts`:
  - 닫히지 않은 102 그룹이 EOF 까지 모든 그룹을 삼켜 뒤 엔티티를 잃던 문제 → 0 그룹에서 멈추고 되돌림(G-05).
  - 앱 이름 `{__proto__` 에서 `groupCodes.push is not a function` 으로 크래시하던 문제 → 자기 속성으로만 등록(G-07).
