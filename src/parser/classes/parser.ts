import {
  Abort,
  createParser,
  DXFParserSnippet,
  Identity,
  ToBoolean,
} from '../shared/parserGenerator.ts'

export const DxfClassParserSnippets: DXFParserSnippet[] = [
  {
    code: 281,
    name: 'isEntity',
    parser: ToBoolean,
  },
  {
    code: 280,
    name: 'wasProxy',
    parser: ToBoolean,
  },
  {
    code: 91,
    name: 'instanceCount',
    parser: Identity,
  },
  {
    code: 90,
    name: 'proxyFlag',
    parser: Identity,
  },
  {
    code: 3,
    name: 'appName',
    parser: Identity,
  },
  {
    code: 2,
    name: 'cppClassName',
    parser: Identity,
  },
  {
    code: 1,
    name: 'name',
    parser: Identity,
  },
]

export const parseDxfClass = createParser(DxfClassParserSnippets)

export const DxfClassesParserSnippets: DXFParserSnippet[] = [
  {
    code: 0,
    name: 'classes',
    isMultiple: true,
    parser(curr, scanner) {
      if (curr.value !== 'CLASS') {
        return Abort
      }
      curr = scanner.next()
      const dxfClass = {}
      parseDxfClass(curr, scanner, dxfClass)
      return dxfClass
    },
  },
]

export const parseDxfClasses = createParser(DxfClassesParserSnippets)
