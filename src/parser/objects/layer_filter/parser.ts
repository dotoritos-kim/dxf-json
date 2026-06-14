import type { DXFParserSnippet } from '../../shared/parserGenerator.ts'
import { Identity } from '../../shared/parserGenerator.ts'
import { CommonObjectSnippets } from '../shared.ts'

export const LayerFilterSnippets: DXFParserSnippet[] = [
  {
    code: 8,
    name: 'layerNames',
    parser: Identity,
    isMultiple: true,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  {
    code: 100,
    name: 'filterSubclassMarker',
    parser: Identity,
  },
  ...CommonObjectSnippets,
]
