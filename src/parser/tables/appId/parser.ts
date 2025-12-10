import {
  createParser,
  DXFParserSnippet,
  Identity,
} from '../../shared/parserGenerator.ts'
import { CommonTableEntryParserSnippets } from '../shared.ts'

export const AppIdTableParserSnippets: DXFParserSnippet[] = [
  {
    code: 70,
    name: 'flag',
    parser: Identity,
  },
  {
    code: 2,
    name: 'appName',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonTableEntryParserSnippets,
]

export const parseAppIdTableEntry = createParser(AppIdTableParserSnippets)
