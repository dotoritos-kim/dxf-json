import type { DXFParserSnippet } from '../../shared/parserGenerator.ts'
import { Identity } from '../../shared/parserGenerator.ts'
import { CommonObjectSnippets } from '../shared.ts'

export const LayerIndexSnippets: DXFParserSnippet[] = [
  {
    code: 90,
    name: 'idBufferEntryCounts',
    parser: Identity,
    isMultiple: true,
  },
  {
    code: 360,
    name: 'idBufferIds',
    parser: Identity,
    isMultiple: true,
  },
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
    code: 40,
    name: 'timeStamp',
    parser: Identity,
  },
  {
    code: 100,
    name: 'indexSubclassMarker',
    parser: Identity,
  },
  ...CommonObjectSnippets,
]
