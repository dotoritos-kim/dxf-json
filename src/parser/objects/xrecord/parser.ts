import { type DXFParserSnippet, Identity } from '@src/parser/shared/parserGenerator';

/*
  XRECORD OBJECT has no fixed form.
  It may contain whatever between 1 ~ 369 except 5 and 105 indefinetly.
  For more information, see https://help.autodesk.com/view/OARX/2018/ENU/?guid=GUID-24668FAF-AE03-41AE-AFA4-276C3692827F
*/
export const XRecordDXFObjectSnippet: DXFParserSnippet[] = [
  {
    code: 280,
    name: 'cloneFlag',
    parser(curr, scanner, entity) {
      const flag = curr.value as number

      curr = scanner.next()
      entity.data = []

      while (checkXRecordGroup(curr.code)) {  
        entity.data.push(curr)
        curr = scanner.next()
      }

      scanner.rewind()
      return flag
    }
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  }
]

function checkXRecordGroup(code: number): boolean {
  return 1 <= code && code <= 369 && code !== 5 && code !== 105
}