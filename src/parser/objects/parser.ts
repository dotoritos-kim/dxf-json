import type { DxfArrayScanner, ScannerGroup } from '../DxfArrayScanner.ts'
import { createParser, DXFParserSnippet } from '../shared/parserGenerator.ts'
import { LayoutSnippets } from './layout/parser.ts'
import { PlotSettingsSnippets } from './plotSettings/parser.ts'
import { DictionarySnippets } from './dictionary/parser.ts'
import { SpatialFilterSnippets } from './spatial_filter/parser.ts'
import { ImageDefSnippets } from './imageDef/parser.ts'
import { MLeaderStyleSnippets } from './mleaderStyle/parser.ts'
import { MLineStyleSnippets } from './mlineStyle/parser.ts'
import { GroupSnippets } from './group/parser.ts'
import { LayerFilterSnippets } from './layer_filter/parser.ts'
import { LayerIndexSnippets } from './layer_index/parser.ts'
import { DimAssocSnippets } from './dimassoc/parser.ts'
import { classify } from '../../utlis.ts'

const ObjectSchemas: Record<string, DXFParserSnippet[]> = {
  LAYOUT: LayoutSnippets,
  PLOTSETTINGS: PlotSettingsSnippets,
  DICTIONARY: DictionarySnippets,
  SPATIAL_FILTER: SpatialFilterSnippets,
  IMAGEDEF: ImageDefSnippets,
  MLEADERSTYLE: MLeaderStyleSnippets,
  MLINESTYLE: MLineStyleSnippets,
  GROUP: GroupSnippets,
  LAYER_FILTER: LayerFilterSnippets,
  LAYER_INDEX: LayerIndexSnippets,
  DIMASSOC: DimAssocSnippets,
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
        // 객체가 EOF 직전에 끝나면(ENDSEC 누락) peek 가 throw 하므로 EOF 로 종료
        curr = scanner.isEOF() ? { code: 0, value: 'EOF' } : scanner.peek()
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
