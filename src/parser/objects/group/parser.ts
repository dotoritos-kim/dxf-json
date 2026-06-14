import type { DXFParserSnippet } from '../../shared/parserGenerator.ts'
import {
  Identity,
  ToBoolean,
} from '../../shared/parserGenerator.ts'
import { CommonObjectSnippets } from '../shared.ts'

export const GroupSnippets: DXFParserSnippet[] = [
  {
    code: 340,
    name: 'entityIds',
    parser: Identity,
    isMultiple: true,
  },
  {
    code: 71,
    name: 'isSelectable',
    parser: ToBoolean,
  },
  {
    code: 70,
    name: 'isUnnamed',
    parser: ToBoolean,
  },
  {
    code: 300,
    name: 'description',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonObjectSnippets,
]
