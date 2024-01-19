# DXF-JSON

## Perfect Dxf Parser

A library that reliably parses DXF files into JSON files without missing data.

- It is typesafe.
- Parse dxfs at high speed.
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
const parser = new DxfParser();
return await parser.parseStream(fileStream);
```

parseUrl:

```ts
const parser = new DxfParser();
return await parser.parseFromUrl(url, encoding, RequestInit);
```

## License

GPL-3.0 license
