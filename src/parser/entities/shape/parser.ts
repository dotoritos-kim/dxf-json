import type { DxfArrayScanner, ScannerGroup } from '../../DxfArrayScanner.ts'
import {
  createParser,
  DXFParserSnippet,
  Identity,
  PointParser,
} from '../../shared/parserGenerator.ts'
import { CommonEntitySnippets } from '../shared.ts'
import type { ShapeEntity } from './types.ts'

export const DefaultShapeEntity = {
  thickness: 0,
  rotation: 0,
  xScale: 1,
  obliqueAngle: 0,
  extrusionDirection: { x: 0, y: 0, z: 1 },
}

export const ShapeEntityParserSnippets: DXFParserSnippet[] = [
  {
    code: 210,
    name: 'extrusionDirection',
    parser: PointParser,
  },
  {
    code: 51,
    name: 'obliqueAngle',
    parser: Identity,
  },
  {
    code: 41,
    name: 'xScale',
    parser: Identity,
  },
  {
    code: 50,
    name: 'rotation',
    parser: Identity,
  },
  {
    code: 2,
    name: 'shapeName',
    parser: Identity,
  },
  {
    code: 40,
    name: 'size',
    parser: Identity,
  },
  {
    code: 10,
    name: 'insertionPoint',
    parser: PointParser,
  },
  {
    code: 39,
    name: 'thickness',
    parser: Identity,
  },
  {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
  ...CommonEntitySnippets,
]

export class ShapeEntityParser {
  static ForEntityName = 'SHAPE'
  private parser = createParser(ShapeEntityParserSnippets, DefaultShapeEntity)

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any
    this.parser(curr, scanner, entity)
    return entity as ShapeEntity
  }
}
