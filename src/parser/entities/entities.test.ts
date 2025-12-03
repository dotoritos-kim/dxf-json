import { describe, it, expect, test } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { DxfArrayScanner } from '../DxfArrayScanner.ts'
import { parseEntities } from './parser.ts'

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
            const scanner = new DxfArrayScanner(content);
            let curr = scanner.next();

            parseEntities(curr, scanner);

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
            const scanner = new DxfArrayScanner(content);
            let curr = scanner.next();

            parseEntities(curr, scanner);

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
            const scanner = new DxfArrayScanner(content);
            let curr = scanner.next();

            const entities = parseEntities(curr, scanner);

            expect(entities.length).toBe(2);
            expect(entities[0].handle).toBe('entity-0');
            expect(entities[1].handle).toBe('entity-1');
        });

        it('should parse app extension properly', () => {
            const content = ` 0
LINE
 5
entity-0
102
{ACAD_REACTORS
330
soft-id
102
}
102
{ACAD_XDICTIONARY
360
hard-id
102
}
102
{FOO
2
bar
102
}
330
D9B071D01A0ACD38
  100
AcDbLine
  100
AcDbEntity
  0
ENDSEC
  0
EOF`.split('\n')
            const scanner = new DxfArrayScanner(content)
            let curr = scanner.next()

            const entities = parseEntities(curr, scanner)
            
            expect(entities.length).toBe(1)
            expect(entities[0].extensions).toMatchObject({
                'ACAD_REACTORS': [
                    { code: 330, value: 'soft-id' },
                ],
                'ACAD_XDICTIONARY': [
                    { code: 360, value: 'hard-id' },
                ],
                'FOO': [
                    { code: 2, value: 'bar' },
                ]
            })
        })
    });

    test('tc0', () => {  
      const content = readFileSync(join(__dirname, './tc0.partial_dxf'), 'utf-8');
      const scanner = new DxfArrayScanner(content.split('\n'));
      let curr = scanner.next()
      const entities = parseEntities(curr, scanner)

      expect(entities[0]).toMatchObject({
        proxyByte: 254,
        proxyEntity: '2C080000470000000C0000001300000000000000880000001D000000000000000000F03F0000000000000000000000000000000000000000000000000000000000000000000000000000F03F0000000000000000000000000000000000000000000000000000000000000000000000000000F03F0000000000000000000000000000000000000000000000000000000000000000000000000000F03F0C00000016000000070000C30C00000017000000FDFFFFFF0C00000012000000FF7F000054000000200000000200000000000000000074400200000000A03E4000000000000000000000000000007440FEFFFFFFFF9F444000000000000000000000'
      })
    })
});