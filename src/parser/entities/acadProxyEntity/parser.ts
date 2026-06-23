import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import { isMatched } from '../../shared/isMatched.ts'
import { parseExtensions } from '../../shared/extensions/parser.ts'
import { parseXData } from '../../shared/xdata/parser.ts'
import type { AcadProxyEntity } from './types.ts'

type BinarySection = 'graphics' | 'entity' | 'unknown' | 'none'

export class AcadProxyEntityParser {
  static ForEntityName = 'ACAD_PROXY_ENTITY'

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup): AcadProxyEntity {
    const entity = {} as AcadProxyEntity
    let binarySection: BinarySection = 'none'
    let inProxySubclass = false

    while (!isMatched(curr, 0, 'EOF')) {
      switch (curr.code) {
        case 100:
          if (curr.value === 'AcDbProxyEntity') {
            entity.subclassMarker = 'AcDbProxyEntity'
            inProxySubclass = true
          }
          break
        case 90:
          entity.proxyEntityClassId = curr.value as number
          binarySection = 'none'
          break
        case 91:
          entity.applicationEntityClassId = curr.value as number
          binarySection = 'none'
          break
        case 1:
          if (inProxySubclass) {
            entity.originalDxfName = String(curr.value)
          }
          break
        case 92:
        case 160:
          entity.graphicsDataSize = curr.value as number
          binarySection = 'graphics'
          break
        case 93:
        case 161:
          entity.entityDataSize = curr.value as number
          binarySection = 'entity'
          break
        case 96:
        case 162:
          entity.unknownDataSize = curr.value as number
          binarySection = 'unknown'
          break
        case 310:
          if (binarySection === 'graphics') {
            entity.graphicsData = (entity.graphicsData ?? '') + curr.value
          } else if (binarySection === 'entity') {
            entity.entityData = (entity.entityData ?? '') + curr.value
          }
          break
        case 311:
          if (binarySection === 'unknown') {
            entity.unknownData = (entity.unknownData ?? '') + curr.value
          }
          break
        case 330:
        case 340:
        case 350:
        case 360:
          binarySection = 'none'
          if (inProxySubclass) {
            ;(entity.linkedObjectIds ??= []).push(String(curr.value))
          } else if (curr.code === 330) {
            entity.ownerBlockRecordSoftId = String(curr.value)
          }
          break
        case 94:
          binarySection = 'none'
          break
        case 95:
          entity.objectDrawingFormat = curr.value as number
          break
        case 70:
          entity.originalDataFormat = curr.value as AcadProxyEntity['originalDataFormat']
          break
        case 5:
          entity.handle = String(curr.value)
          break
        case 102:
          parseExtensions(curr, scanner, entity)
          break
        case 67:
          entity.isInPaperSpace = !!curr.value
          break
        case 8:
          entity.layer = String(curr.value)
          break
        case 6:
          entity.lineType = String(curr.value)
          break
        case 347:
          entity.materialObjectHardId = String(curr.value)
          break
        case 62:
          entity.colorIndex = curr.value as number
          break
        case 370:
          entity.lineweight = curr.value as number
          break
        case 48:
          entity.lineTypeScale = curr.value as number
          break
        case 60:
          entity.isVisible = !!curr.value
          break
        case 420:
          entity.color = curr.value as number
          break
        case 430:
          entity.colorName = String(curr.value)
          break
        case 440:
          entity.transparency = curr.value as number
          break
        case 380:
          entity.plotStyleType = curr.value as number
          break
        case 390:
          entity.plotStyleHardId = String(curr.value)
          break
        case 284:
          entity.shadowMode = curr.value as number
          break
        case 410:
          entity.layoutTabName = String(curr.value)
          break
        case 1001:
          ;(entity.xdata ??= []).push(parseXData(curr, scanner))
          break
        default:
          scanner.rewind()
          return entity
      }
      curr = scanner.next()
    }

    scanner.rewind()
    return entity
  }
}
