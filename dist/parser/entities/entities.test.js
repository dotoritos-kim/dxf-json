"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const DxfArrayScanner_1 = __importDefault(require("../DxfArrayScanner"));
describe('ENTITIES section', () => {
    describe('parseEntities', () => {
        it('BLOCKS 섹션 안에서 parseEntities를 실행하면 scanner.next()가 <0, ENDBLK>이어야 한다.', () => {
            const content = ` 0
LINE
 5
entity-0
 100
AcDbLine
 100
AcDbEntity
 0
ENDBLK
 0
EOF
`.split('\n');
            const scanner = new DxfArrayScanner_1.default(content);
            let curr = scanner.next();
            (0, _1.parseEntities)(curr, scanner);
            curr = scanner.next();
            expect(curr.code).toBe(0);
            expect(curr.value).toBe('ENDBLK');
        });
        it('ENTITIES 섹션 안에서 parseEntities를 실행하면 scanner.next()가 <0, ENDSEC>이어야 한다.', () => {
            const content = ` 0
LINE
  5
entity-0
  100
AcDbLine
  100
AcDbEntity
  0
ENDSEC
  0
EOF
`.split('\n');
            const scanner = new DxfArrayScanner_1.default(content);
            let curr = scanner.next();
            (0, _1.parseEntities)(curr, scanner);
            curr = scanner.next();
            expect(curr.code).toBe(0);
            expect(curr.value).toBe('ENDSEC');
        });
        it('parseEntities는 모든 ENTITY를 소모하여야 한다.', () => {
            const content = ` 0
LINE
 5
entity-0
 100
AcDbLine
 0
LINE
 5
entity-1
 100
AcDbLine
 100
AcDbEntity
 0
ENDBLK
 0
EOF
`.split('\n');
            const scanner = new DxfArrayScanner_1.default(content);
            let curr = scanner.next();
            const entities = (0, _1.parseEntities)(curr, scanner);
            expect(entities.length).toBe(2);
            expect(entities[0].handle).toBe('entity-0');
            expect(entities[1].handle).toBe('entity-1');
        });
    });
});
//# sourceMappingURL=entities.test.js.map