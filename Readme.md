# DXF-JSON

<p align="center">
  <img width="100%" src="https://github.com/dotoritos-kim/dxf-json/assets/14037015/a534bedc-3191-4f7b-a610-f3291a77ca6c">
</p>

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

[![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/dxf-json)

DXF parser with rich type definitions.

> [!CAUTION]
> This is parser is not in stable state yet. Until version 1.0, we may often change name or type of the variables. We're adding rich unit/integration test, but there might be unexpected bug or uncovered situation. Note that [official DXF specification](https://documentation.help/AutoCAD-DXF/) is poorly documented, so that many informations are missing and even errors exist. Use your own risk. Thank you for your consideration.

## Quick Start

```
npm i dxf-json # or your loved package manager
```

```ts
import { readFileSync } from 'fs'
import { DxfParser } from 'dxf-json'

const content = readFileSync('foo.dxf', 'utf-8')
const parser = new DxfParser()
const parsedDxf = parser.parseSync(content)

// play with your dxf file
const lwPolylines = parsedDxf.entities.filter(
  (entity) => entity.type === 'LWPOLYLINE',
)
```

### About `moduleResolution` in TypeScript

It's impossible to support both ESM and CJS with `node16`, because they detect type of modules only by `type` field in `package.json` or the extension of files. To support CJS with `node16`, we have to rename every `.d.ts` files into `.d.cts`, not only the file name but also every `import` expression in source files.

But Node16 is already deprecated, and to maintain the open source society healthy, we decided not to support `require` at that version. Also we **highly recommend to use ESM styled `import`** consistently throughout your source code.

| Module Resolution | From ESM | From CJS |
| ----------------- | -------- | -------- |
| `node10`          | ✅       | ✅       |
| `node16`          | ✅       | ❌       |
| `bundler`         | ✅       | ✅       |

## Features

- Synchronous parsing, asynchronous parsing, and url fetch are possible.
- Support both ESM and CJS
- Support TypeScript

> [!NOTE]
> We support standard specification of dxf and AutoCAD features only. We're trying our best to support universal dxf files, but we don't support 3rd party specification.

<details><summary>Current Coverage</summary>

For `dev` branch status, see [#52](https://github.com/dotoritos-kim/dxf-json/issues/52)

Based on [AutoCAD 2024 DXF Reference](https://help.autodesk.com/view/OARX/2024/ENU/?guid=GUID-235B22E0-A567-4CF6-92D3-38A2306D73F3)

- [x] HEADER Section
- [x] CLASSES Section
- [x] TABLES Section
  - [x] APPID
  - [x] BLOCK_RECORD
  - [x] DIMSTYLE
  - [x] LAYER
  - [x] LTYPE
  - [x] STYLE
  - [x] UCS
  - [x] VIEW
  - [x] VPORT
- [x] BLOCKS Section
- [ ] ENTITIES Section
  - [x] 3DFACE
  - [x] 3DSOLID
  - [ ] ACAD_PROXY_ENTITY
  - [x] ARC
  - [x] ARC_DIMENSION
  - [x] ATTDEF
  - [x] ATTRIB
  - [x] BODY
  - [x] CIRCLE
  - [ ] COORDINATION MODEL
  - [x] DIMENSION
  - [x] ELLIPSE
  - [x] HATCH
  - [ ] HELIX
  - [x] IMAGE
  - [x] INSERT
  - [x] LEADER
  - [x] LIGHT
  - [x] LINE
  - [x] LWPOLYLINE
  - [x] MESH
  - [x] MLEADER
  - [ ] MLEADERSTYLE
  - [x] MLINE
  - [x] MTEXT
  - [ ] OLEFRAME
  - [ ] OLE2FRAME
  - [x] POINT
  - [x] POLYLINE
  - [x] RAY
  - [x] REGION
  - [x] SECTION
  - [ ] SEQEND
  - [ ] SHAPE
  - [x] SOLID
  - [x] SPLINE
  - [x] SUN
  - [ ] SURFACE
  - [ ] TABLE
  - [x] TEXT
  - [x] TOLERANCE
  - [ ] TRACE
  - [ ] UNDERLAY
  - [x] VERTEX
  - [x] VIEWPORT
  - [x] WIPEOUT
  - [x] XLINE
- [ ] OBJECTS Section
  - [ ] DATATABLE
  - [x] DICTIONARY
  - [ ] DICTIONARYVAR
  - [ ] DIMASSOC
  - [ ] FIELD
  - [ ] GEODATA
  - [ ] GROUP
  - [ ] IDBUFFER
  - [ ] IMAGEDEF
  - [ ] IMAGEDEF_REACTOR
  - [ ] LAYER_FILTER
  - [ ] LAYER_INDEX
  - [x] LAYOUT
  - [ ] LIGHTLIST
  - [ ] MATERIAL
  - [ ] MLINESTYLE
  - [ ] OBJECT_PTR
  - [x] PLOTSETTINGS
  - [ ] RASTERVARIABLES
  - [ ] RENDER
  - [ ] SECTION
  - [ ] SORTENSTABLE
  - [x] SPATIAL_FILTER
  - [ ] SPATIAL_INDEX
  - [ ] SUNSTUDY
  - [ ] TABLESTYLE
  - [ ] UNDERLAYDEFINITION
  - [ ] VBA_PROJECT
  - [ ] VISUALSTYLE
  - [ ] WIPEOUTVARIABLES
  - [x] XRECORD
- [x] THUMBNAILIMAGE Section

</details>

> [!NOTE]
> The documentation is not ready, but you can check the source code for used types [#1](https://github.com/dotoritos-kim/dxf-json/blob/main/src/parser/types.ts) and [#2](https://github.com/dotoritos-kim/dxf-json/blob/main/integration-test/src/types/import-test.ts)

## Parsing Options

### Thumbnail Image Format

You can configure how the `THUMBNAILIMAGE` section is parsed by setting the `thumbnailImageFormat` option:

```ts
import { DxfParser } from 'dxf-json'

// Default: base64 format (ready for web display)
const parser1 = new DxfParser()
const result1 = parser1.parseSync(dxfContent)
// result1.thumbnailImage.data is a base64 string
// Usage: <img src="data:image/bmp;base64,${result1.thumbnailImage.data}" />

// Hex format (raw hexadecimal string)
const parser2 = new DxfParser({ thumbnailImageFormat: 'hex' })
const result2 = parser2.parseSync(dxfContent)
// result2.thumbnailImage.data is a hex string

// Buffer format (Node.js Buffer object)
const parser3 = new DxfParser({ thumbnailImageFormat: 'buffer' })
const result3 = parser3.parseSync(dxfContent)
// result3.thumbnailImage.data is a Buffer
// Save to file: fs.writeFileSync('thumbnail.bmp', result3.thumbnailImage.data)
```

**Available formats:**
- `'base64'` (default): Base64-encoded string, ideal for web applications
- `'hex'`: Raw hexadecimal string from the DXF file
- `'buffer'`: Node.js Buffer object for file operations

> [!NOTE]
> The thumbnail image in DXF files is typically in BMP format.

### `parseSync`

```ts
const parser = new DxfParser()
return parser.parseSync(buffer)
```

### `parseStream`

```ts
import fs from 'fs'
const parser = new DxfParser()
const fileStream = fs.createReadStream('dxf file path', { encoding: 'utf8' })
return await parser.parseStream(fileStream)
```

### `parseUrl`

```ts
const parser = new DxfParser()
return await parser.parseFromUrl(url, encoding, RequestInit)
```

## Contribution

See [CONTRIBUTING.md](https://github.com/dotoritos-kim/dxf-json/blob/main/CONTRIBUTING.md)
