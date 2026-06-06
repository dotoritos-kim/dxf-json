import {
  DXFParserSnippet,
  Identity,
  PointParser,
} from '../../shared/parserGenerator.ts';

export const ImageDefSnippets: DXFParserSnippet[] = [
  {
    code: 330,
    name: 'imageDefReactorIdSoft',
    isMultiple: true,
    parser: Identity,
  }, {
    code: 90,
    name: 'version',
    parser: Identity,
  }, {
    code: 1,
    name: 'fileName',
    parser: Identity,
  }, {
    code: 10,
    name: 'size',
    parser: PointParser,
  }, {
    code: 11,
    name: 'sizeOfOnePixel',
    parser: PointParser,
  }, {
    code: 280,
    name: 'isLoaded',
    parser: Identity,
  }, {
    code: 281,
    name: 'resolutionUnits',
    parser: Identity,
  }, {
    code: 100,
    name: 'subclassMarker',
    parser: Identity,
  },
];