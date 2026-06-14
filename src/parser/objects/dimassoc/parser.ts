import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import type { DXFParserSnippet } from '../../shared/parserGenerator.ts'
import {
  Identity,
  PointParser,
  ToBoolean,
} from '../../shared/parserGenerator.ts'
import { CommonObjectSnippets } from '../shared.ts'
import type { DimAssocPointRef } from './types.ts'

export const DimAssocSnippets: DXFParserSnippet[] = [
  {
    code: 75,
    name: 'hasLastPointRef',
    parser: ToBoolean,
  },
  {
    code: 1,
    name: 'pointRefs',
    parser: parsePointRef,
    isMultiple: true,
  },
  {
    code: 71,
    name: 'rotatedDimensionType',
    parser: Identity,
  },
  {
    code: 70,
    name: 'transSpaceFlag',
    parser: ToBoolean,
  },
  {
    code: 90,
    name: 'associativityFlag',
    parser: Identity,
  },
  {
    code: 330,
    name: 'dimensionObjectId',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonObjectSnippets,
]

function parsePointRef(
  curr: ScannerGroup,
  scanner: DxfArrayScanner,
): DimAssocPointRef {
  const pointRef: DimAssocPointRef = {
    className: curr.value,
  }

  while (true) {
    curr = scanner.next()

    switch (curr.code) {
      case 72:
        pointRef.objectOsnapType = curr.value
        continue
      case 331:
        pointRef.mainObjectId = curr.value
        continue
      case 73:
        pointRef.mainObjectSubentityType = curr.value
        continue
      case 91:
        pointRef.mainObjectGsMarker = curr.value
        continue
      case 301:
        pointRef.mainObjectXrefHandle = curr.value
        continue
      case 40:
        pointRef.nearOsnapGeometryParameter = curr.value
        continue
      case 10:
        {
          const osnapPoint = PointParser(curr, scanner)
          pointRef.osnapPoint =
            'z' in osnapPoint ? osnapPoint : { ...osnapPoint, z: 0 }
        }
        continue
      case 332:
        pointRef.intersectionObjectId = curr.value
        continue
      case 74:
        pointRef.intersectionObjectSubentityType = curr.value
        continue
      case 92:
        pointRef.intersectionObjectGsMarker = curr.value
        continue
      case 302:
        pointRef.intersectionObjectXrefHandle = curr.value
        continue
      default:
        scanner.rewind()
        return pointRef
    }
  }
}
