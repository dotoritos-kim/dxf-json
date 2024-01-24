# DXF-JSON

<p align="center">
  <img width="100%" src="https://github.com/dotoritos-kim/dxf-json/assets/14037015/a534bedc-3191-4f7b-a610-f3291a77ca6c">
</p>

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)

[![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/dxf-json)

## Perfect Dxf Parser

A library that reliably parses DXF files into JSON files without missing data.

- It is typesafe.
- Parse dxf at high speed.
- Lightweight library

## Features

- Synchronous parsing, asynchronous parsing, and url fetch are possible.
- It was created for the purpose of parsing the AutoCad Dxf format. [Dxf ref](https://documentation.help/AutoCAD-DXF/)
- It is modularized and divided into Header, Classes, Tables, Blocks, Entities, and Objects sections.
- It's very simple to use.
- When I input dxf file it returns json data.

The goal of this library is to fully analyze dxf files from AutoCad and convert them to json files.

## Coverage

Block:

- The BLOCKS section of the DXF file contains an entry for each block reference in the drawing.

Header:

- Most headers can be loaded. All that remains is to add types and add descriptions.

Entity:

- arc
- attdef
- attribute
- circle
- dimension
- ellipse
- hatch
- insert
- leader
- line
- lwpolyline
- mtext
- point
- polyline
- section
- solid
- spline
- text
- vertex
- viewport

Tables:

- blockRecord
- dimStyle
- layer
- ltype
- style
- vport

Objects:

- dictionary
- layout
- plotSettings

## Reference

I was able to get a lot of ideas from the  [dxf-parser](https://github.com/gdsestimating/dxf-parser) library.

## How do I use it?

npm package:

```sh
npm i dxf-json
```

build:

```sh
npm install
npm run build
```

test:

```sh
npm install
npm run test:parser
```

parseSync:

```ts
const parser = new DxfParser()
return parser.parseSync(buffer)
```

parseStream:

```ts
import fs from 'fs'
const parser = new DxfParser();
const fileStream = fs.createReadStream("dxf file path", { encoding: 'utf8' });
return await parser.parseStream(fileStream);
```

parseUrl:

```ts
const parser = new DxfParser();
return await parser.parseFromUrl(url, encoding, RequestInit);
```

## Type

ParsedDxf:

```ts
interface ParsedDxf {
    header: DxfHeader;
    blocks: Record<string, DxfBlock>;
    entities: CommonDxfEntity[];
    tables: {
        BLOCK_RECORD?: DxfTable<BlockRecordTableEntry>;
        DIMSTYLE?: DxfTable<DimStylesTableEntry>;
        STYLE?: DxfTable<StyleTableEntry>;
        LAYER?: DxfTable<LayerTableEntry>;
        LTYPE?: DxfTable<LTypeTableEntry>;
        VPORT?: DxfTable<VPortTableEntry>;
    };
    objects: {
        byName: Record<string, CommonDXFObject[]>;
        byTree?: DxfObject;
    };
}
```

### header

DxfHeader:

```ts
type DxfHeaderVariable =
...
    | 'DRAGVS'
    | 'INTERFERECOLOR'
    | 'INTERFEREOBJVS'
    | 'INTERFEREVPVS'
    | 'OBSLTYPE'
    | 'SHADEDIF'
    | 'MEASUREMENT';

export type DxfHeader = typeof DefaultDxfHeaderVariables & {
    MEASUREMENT: Measurement;
} & Record<string, any>;
```

### blocks

DxfBlock:

```ts
interface DxfBlock {
    type: number;
    name: string;
    name2: string;
    handle: string;
    ownerHandle: string;
    layer: string;
    position: Point3D;
    paperSpace: boolean;
    xrefPath: string;
    entities?: CommonDxfEntity[];
}
```

### entities

CommonDxfEntity:

```ts
interface CommonDxfEntity {
    type: string;
    handle: string;
    ownerBlockRecordSoftId?: string;
    isInPaperSpace?: boolean;
    layer: string;
    lineType?: string;
    materialObjectHardId?: string;
    colorIndex?: ColorIndex;
    lineweight?: number;
    lineTypeScale?: number;
    isVisible?: boolean;
    proxyByte?: number;
    proxyEntity?: string;
    color?: ColorInstance;
    colorName?: string;
    transparency?: number;
    plotStyleHardId?: string;
    shadowMode?: ShadowMode;
    xdata?: XData;
    ownerdictionaryHardId?: string | number | boolean;
    ownerDictionarySoftId?: string | number | boolean;
}
```

### tables

```ts
tables: {
    BLOCK_RECORD?: DxfTable<BlockRecordTableEntry>;
    DIMSTYLE?: DxfTable<DimStylesTableEntry>;
    STYLE?: DxfTable<StyleTableEntry>;
    LAYER?: DxfTable<LayerTableEntry>;
    LTYPE?: DxfTable<LTypeTableEntry>;
    VPORT?: DxfTable<VPortTableEntry>;
};
```

#### DxfTable

```ts
interface DxfTable<T extends CommonDxfTableEntry> {
    subclassMarker: 'AcDbSymbolTable';
    name: string;
    handle: string;
    ownerDictionaryIds?: string[];
    ownerObjectId: string;
    maxNumberOfEntries: number;
    entries: T[];
}
interface CommonDxfTableEntry {
    name: string;
    handle: string;
    ownerObjectId: string;
}
```

#### BLOCK_RECORD

BlockRecordTableEntry:

```ts
interface BlockRecordTableEntry extends CommonDxfTableEntry {
    subclassMarker: 'AcDbBlockTableRecord';
    name: string;
    layoutObjects: string;
    insertionUnits: number;
    explodability: number;
    scalability: number;
    bmpPreview: string;
}
```

#### DIMSTYLE

```ts
type DimStyleVariable =
    | 'DIMPOST'
    | 'DIMAPOST'
    | 'DIMBLK_OBSOLETE'
    | 'DIMBLK1_OBSOLETE'
    | 'DIMBLK2_OBSOLETE'
    | 'DIMSCALE'
    | 'DIMASZ'
    | 'DIMEXO'
    | 'DIMDLI'
    | 'DIMEXE'
    | 'DIMRND'
    | 'DIMDLE'
    | 'DIMTP'
    | 'DIMTM'
    | 'DIMTXT'
    | 'DIMCEN'
    | 'DIMTSZ'
    | 'DIMALTF'
    | 'DIMLFAC'
    | 'DIMTVP'
    | 'DIMTFAC'
    | 'DIMGAP'
    | 'DIMALTRND'
    | 'DIMTOL'
    | 'DIMLIM'
    | 'DIMTIH'
    | 'DIMTOH'
    | 'DIMSE1'
    | 'DIMSE2'
    | 'DIMTAD'
    | 'DIMZIN'
    | 'DIMAZIN'
    | 'DIMALT'
    | 'DIMALTD'
    | 'DIMTOFL'
    | 'DIMSAH'
    | 'DIMTIX'
    | 'DIMSOXD'
    | 'DIMCLRD'
    | 'DIMCLRE'
    | 'DIMCLRT'
    | 'DIMADEC'
    | 'DIMUNIT'
    | 'DIMDEC'
    | 'DIMTDEC'
    | 'DIMALTU'
    | 'DIMALTTD'
    | 'DIMAUNIT'
    | 'DIMFRAC'
    | 'DIMLUNIT'
    | 'DIMDSEP'
    | 'DIMTMOVE'
    | 'DIMJUST'
    | 'DIMSD1'
    | 'DIMSD2'
    | 'DIMTOLJ'
    | 'DIMTZIN'
    | 'DIMALTZ'
    | 'DIMALTTZ'
    | 'DIMFIT'
    | 'DIMUPT'
    | 'DIMATFIT'
    | 'DIMTXSTY'
    | 'DIMLDRBLK'
    | 'DIMBLK'
    | 'DIMBLK1'
    | 'DIMBLK2'
    | 'DIMLWD'
    | 'DIMLWE';

interface DimStyleVariableSchema {
    name: string;
    code: number;
    defaultValue?: string | number;
    defaultValueImperial?: string | number;
}

type DimStylesTableEntry = {
    subclassMarker: 'AcDbDimStyleTableRecord';
    styleName: string;
    DIMPOST?: string;
    DIMAPOST?: string;
    DIMBLK_OBSOLETE?: string;
    DIMBLK1_OBSOLETE?: string;
    DIMBLK2_OBSOLETE?: string;
    DIMSCALE: number;
    DIMASZ: number;
    DIMEXO: number;
    DIMDLI: number;
    DIMEXE: number;
    DIMRND: number;
    DIMDLE: number;
    DIMTP: number;
    DIMTM: number;
    DIMTXT: number;
    DIMCEN: number;
    DIMTSZ: number;
    DIMALTF: number;
    DIMLFAC: number;
    DIMTVP: number;
    DIMTFAC: number;
    DIMGAP: number;
    DIMALTRND: number;
    DIMTOL: number;
    DIMLIM: number;
    DIMTIH: number;
    DIMTOH: number;
    DIMSE1: 0 | 1;
    DIMSE2: 0 | 1;
    DIMTAD: DimensionTextVertical;
    DIMZIN: DimensionZeroSuppression;
    DIMAZIN: DimensionZeroSuppressionAngular;
    DIMALT: 0 | 1;
    DIMALTD: number;
    DIMTOFL: 0 | 1;
    DIMSAH: 0 | 1;
    DIMTIX: 0 | 1;
    DIMSOXD: 0 | 1;
    DIMCLRD: number;
    DIMCLRE: number;
    DIMCLRT: number;
    DIMADEC?: number;
    DIMUNIT?: number;
    DIMDEC: number;
    DIMTDEC: number;
    DIMALTU: number;
    DIMALTTD: number;
    DIMAUNIT: number;
    DIMFRAC: number;
    DIMLUNIT: number;
    DIMDSEP: string;
    DIMTMOVE: undefined; // 미사용
    DIMJUST: DimensionTextHorizontal;
    DIMSD1: 0 | 1;
    DIMSD2: 0 | 1;
    DIMTOLJ: DimensionTextVertical;
    DIMTZIN: DimensionZeroSuppression;
    DIMALTZ: DimensionZeroSuppression;
    DIMALTTZ: DimensionZeroSuppression;
    DIMFIT?: number;
    DIMUPT: number;
    DIMATFIT: number;
    DIMTXSTY?: string;
    DIMLDRBLK?: string;
    DIMBLK?: string;
    DIMBLK1?: string;
    DIMBLK2?: string;
    DIMLWD: number;
    DIMLWE: number;
} & CommonDxfTableEntry;

type StyleResolver = <Name extends DimStyleVariable>(
    variableName: Name,
) => DimStylesTableEntry[Name];
```

#### STYLE

```ts
interface StyleTableEntry extends CommonDxfTableEntry {
    subclassMarker: 'AcDbTextStyleTableRecord';
    name: string;
    standardFlag: number;
    fixedTextHeight: number;
    widthFactor: number;
    obliqueAngle: number;
    textGenerationFlag: number;
    lastHeight: number;
    font: string;
    bigFont: string;
    extendedFont?: string;
}
```

#### LAYER

```ts
interface LayerTableEntry extends CommonDxfTableEntry {
    subclassMarker: 'AcDbLayerTableRecord';
    name: string;
    standardFlag: number;
    colorIndex: ColorIndex;
    lineType: string;
    isPlotting: boolean;
    lineweight: number;
    plotStyleNameObjectId?: string;
    materialObjectId?: string;
}
```

#### LTYPE

```ts
interface LTypeTableEntry extends CommonDxfTableEntry {
    subclassMarker: 'AcDbLinetypeTableRecord';
    name: string;
    standardFlag: number;
    description: string;
    numberOfLineTypes: number;
    totalPatternLength: number;
    pattern?: LineTypeElement[];
}
interface LineTypeElement {
    elementLength: number;
    elementTypeFlag: number;
    shapeNumber?: number;
    styleObjectId?: string;
    scale?: number;
    rotation?: number;
    offsetX?: number;
    offsetY?: number;
    text?: string;
}
```

#### VPORT

```ts
interface VPortTableEntry extends CommonDxfTableEntry {
    subclassMarker: 'AcDbViewportTableRecord';
    name: string;
    standardFlag: number;
    lowerLeftCorner: Point2D;
    upperRightCorner: Point2D;
    center: Point2D;
    snapBasePoint: Point2D;
    snapSpacing: Point2D;
    gridSpacing: Point2D;
    viewDirectionFromTarget: Point3D;
    viewTarget: Point3D;
    lensLength: number;
    frontClippingPlane: number;
    backClippingPlane: number;
    viewHeight: number;
    snapRotationAngle: number;
    viewTwistAngle: number;
    circleSides: number;
    frozenLayers: string[];
    styleSheet: string;
    renderMode: RenderMode;
    viewMode: number;
    ucsIconSetting: number;
    ucsOrigin: Point3D;
    ucsXAxis: Point3D;
    ucsYAxis: Point3D;
    orthographicType: OrthographicType;
    elevation: number;
    shadePlotSetting: number;
    majorGridLines: number;
    backgroundObjectId?: string;
    shadePlotObjectId?: string;
    visualStyleObjectId?: string;
    isDefaultLightingOn: boolean;
    defaultLightingType: DefaultLightingType;
    brightness: number;
    contrast: number;
    ambientColor?: number;
}
```

### objects

```ts
objects: {
    byName: Record<string, CommonDXFObject[]>;
    byTree?: DxfObject;
};
```

#### byName

CommonDXFObject:

```ts
interface CommonDXFObject {
    ownerObjectId: string;
    ownerDictionaryIdHard: string;
    ownerDictionaryIdSoft: string;
    handle: string;
}
```

#### DxfObject

```ts
interface DxfObject {
    name: string;
    handle: string;
    ownerDictionaryIdSoft: string;
    ownerDictionaryIdHard?: string;
    ownerObjectId?: string;
}
```

Please refer to the dxf reference for undefined elements and leave them as issues!

## License

GPL-3.0 license
