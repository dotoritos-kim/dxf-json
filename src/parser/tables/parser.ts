import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'
import {
  createParser,
  DXFParserSnippet,
  Identity,
} from '../shared/parserGenerator.ts'
import { isMatched } from '../shared/isMatched.ts'
import type { DxfTable } from './types.ts'
import { parseBlockRecordTable } from './blockRecord/parser.ts'
import { parseDimStyle } from './dimStyle/parser.ts'
import { parseLayerTable } from './layer/parser.ts'
import { parseLTypeTable } from './ltype/parser.ts'
import { parseStyleTable } from './style/parser.ts'
import { parseVPortTable } from './vport/parser.ts'

const TableParsers = {
  BLOCK_RECORD: parseBlockRecordTable,
  DIMSTYLE: parseDimStyle,
  LAYER: parseLayerTable,
  LTYPE: parseLTypeTable,
  STYLE: parseStyleTable,
  VPORT: parseVPortTable,
}

const CommonTableParserSnippets: DXFParserSnippet[] = [
  {
    code: 70,
    name: 'maxNumberOfEntries',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  {
    code: 330,
    name: 'ownerObjectId',
    parser: Identity,
  },
  {
    // ACAD_XDICTIONARY, ignore
    code: 102,
  },
  {
    code: 360,
    isMultiple: true,
  },
  {
    code: 102,
  },
  {
    code: 5,
    name: 'handle',
    parser: Identity,
  },
  {
    code: 2,
    name: 'name',
    parser: Identity,
  },
]

const parseCommonTable = createParser(CommonTableParserSnippets)

export function parseTables(curr: ScannerGroup, scanner: DxfArrayScanner) {
  const tables = {} as any

  while (!isMatched(curr, 0, 'EOF')) {
    if (isMatched(curr, 0, 'ENDSEC')) break

    if (isMatched(curr, 0, 'TABLE')) {
      curr = scanner.next()

      const table = { entries: [] as any[] } as DxfTable<any>
      parseCommonTable(curr, scanner, table)
      tables[table.name] = table
    }

    if (isMatched(curr, 0) && !isMatched(curr, 0, 'ENDTAB')) {
      const name = curr.value
      curr = scanner.next()

      // @ts-ignore
      const parseTable = TableParsers[name]
      if (!parseTable) {
        if (scanner.debug)
          console.warn(`parseTable: Invalid table name '${name}'`)
        curr = scanner.next()
        continue
      }

      const record = {} as any
      parseTable(curr, scanner, record)
      tables[name]?.entries.push(record)
    }
    curr = scanner.next()
  }

  return tables
}
