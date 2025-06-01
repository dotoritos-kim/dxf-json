import type DxfArrayScanner from '../../DxfArrayScanner';
import type { ScannerGroup } from '../../DxfArrayScanner';
import { createParser, DXFParserSnippet, Identity } from '../../shared/parserGenerator';
import { CommonEntitySnippets } from '../shared';

const DefaultWipeoutEntity = {
  displayOptions: 0,
  imageSize: { x: 0, y: 0 },
  imagePosition: { x: 0, y: 0, z: 0 },
};

const WipeoutParserSnippets: DXFParserSnippet[] = [
  { code: 100, name: 'subclassMarker', parser: Identity },
  { code: 70, name: 'displayOptions', parser: Identity },
  { code: 10, name: 'imagePosition.x', parser: Identity },
  { code: 20, name: 'imagePosition.y', parser: Identity },
  { code: 30, name: 'imagePosition.z', parser: Identity },
  { code: 11, name: 'imageSize.x', parser: Identity },
  { code: 21, name: 'imageSize.y', parser: Identity },
  ...CommonEntitySnippets,
];

export class WipeoutParser {
  static ForEntityName = 'WIPEOUT';
  private parser = createParser(WipeoutParserSnippets, DefaultWipeoutEntity);

  parseEntity(scanner: DxfArrayScanner, curr: ScannerGroup) {
    const entity = {} as any;
    this.parser(curr, scanner, entity);
    return entity;
  }
}
