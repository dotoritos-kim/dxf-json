import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import { createParser, DXFParserSnippet, Identity, PointParser } from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';

const DefaultOle2FrameEntity = {
  oleVersion: 0,
  oleType: 0,
  tileMode: 0,
  binaryDataSize: 0,
  upperLeft: { x: 0, y: 0, z: 0 },
  lowerRight: { x: 0, y: 0, z: 0 },
  binaryData: [],
  oleClassName: '',
};

const Ole2FrameParserSnippets: DXFParserSnippet[] = [
  { code: 100, name: 'subclassMarker', parser: Identity },
  { code: 70, name: 'oleVersion', parser: Identity },
  { code: 71, name: 'oleType', parser: Identity },
  { code: 72, name: 'tileMode', parser: Identity },
  { code: 90, name: 'binaryDataSize', parser: Identity },
  { code: 10, name: 'upperLeft.x', parser: Identity },
  { code: 20, name: 'upperLeft.y', parser: Identity },
  { code: 30, name: 'upperLeft.z', parser: Identity },
  { code: 11, name: 'lowerRight.x', parser: Identity },
  { code: 21, name: 'lowerRight.y', parser: Identity },
  { code: 31, name: 'lowerRight.z', parser: Identity },
  { code: 3, name: 'oleClassName', parser: Identity },
  {
    code: 310,
    name: 'binaryData',
    isMultiple: true,
    parser: (curr, _scanner) => curr.value,
  },
  ...CommonEntitySnippets,
];

export class Ole2FrameParser {
  static ForEntityName = 'OLE2FRAME';
  private parser = createParser(Ole2FrameParserSnippets, DefaultOle2FrameEntity);

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any;
    this.parser(curr, scanner, entity);
    return entity;
  }
}
