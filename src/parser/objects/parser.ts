import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'
import { createParser, DXFParserSnippet } from '../shared/parserGenerator.ts'
import { LayoutSnippets } from './layout/parser.ts'
import { PlotSettingsSnippets } from './plotSettings/parser.ts'
import { DictionarySnippets } from './dictionary/parser.ts'
import { SpatialFilterSnippets } from './spatial_filter/parser.ts'
import { classify } from '../../utlis.ts'

const ObjectSchemas: Record<string, DXFParserSnippet[]> = {
  LAYOUT: LayoutSnippets,
  PLOTSETTINGS: PlotSettingsSnippets,
  DICTIONARY: DictionarySnippets,
  SPATIAL_FILTER: SpatialFilterSnippets,
}

export function parseObjects(curr: ScannerGroup, scanner: DxfArrayScanner) {
  const result = [] as any[]

  while (curr.code !== 0 || !['EOF', 'ENDSEC'].includes(curr.value)) {
    const objectName = curr.value as string
    const snippets = ObjectSchemas[objectName]

    if (curr.code === 0 && snippets?.length) {
      const parser = createParser(snippets)
      const parsedObject = { name: objectName } as any

      curr = scanner.next()

      if (parser(curr, scanner, parsedObject)) {
        result.push(parsedObject)
        curr = scanner.peek()
      } else {
        curr = scanner.next()
      }
    } else {
      curr = scanner.next()
    }
  }

  return {
    byName: classify(result, ({ name }) => name),
  }
}
