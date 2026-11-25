# Return types

This page documents the objects returned by `DxfParser.parseSync()` /
`parseStream()` / `parseFromUrl()`. Everything here is read from the source
(`src/parser/types.ts`, `src/parser/**/types.ts` and the parsers that set
defaults). JSON examples are real parser output produced by running
`DxfParser.parseSync()` on the test fixtures in this repository
(`src/parser/entities/*/tc*.partial_dxf` wrapped in an `ENTITIES` section, and
`sample/A_000217.dxf`).

Conventions used below:

- **Code** is the DXF group code. Handles are hexadecimal strings.
- **Default** is the value set when the group code is absent. "—" means the
  field is simply omitted (`undefined`) when the code is absent.
- Fields are only present in the output when the code appears in the file,
  unless a default is listed.
- `Point3D` is `{ x: number, y: number, z: number }`. `z` is optional for
  2D points (missing `30` leaves `z` out).

## 1. `ParsedDxf`

Defined in `src/parser/types.ts`.

```ts
interface ParsedDxf {
  header: DxfHeader
  classes: DxfClass[]
  tables: {
    BLOCK_RECORD?: DxfTable<BlockRecordTableEntry>
    DIMSTYLE?: DxfTable<DimStylesTableEntry>
    STYLE?: DxfTable<StyleTableEntry>
    LAYER?: DxfTable<LayerTableEntry>
    LTYPE?: DxfTable<LTypeTableEntry>
    VPORT?: DxfTable<VPortTableEntry>
  }
  blocks: Record<string, DxfBlock>
  entities: CommonDxfEntity[]
  objects: {
    byName: Record<string, CommonDXFObject[]>
    byTree?: CommonDXFObject
  }
  thumbnailImage?: { size: number; data: string | Buffer }
}
```

| Field            | Source section        | Notes |
| ---------------- | --------------------- | ----- |
| `header`         | `HEADER`              | Header variables keyed by name without `$` (see `src/types/dxfHeader.ts`). `{}` when the section is missing. |
| `classes`        | `CLASSES`             | One `DxfClass` per `0 CLASS`. |
| `tables`         | `TABLES`              | Only the tables listed above are parsed. Each `DxfTable` holds its entries (keyed by entry name). |
| `blocks`         | `BLOCKS`              | Keyed by block name. Each `DxfBlock` carries its own `entities` array, parsed with the same entity parsers as the `ENTITIES` section. |
| `entities`       | `ENTITIES`            | Model/paper space entities in file order. Narrow by `type` (see below). |
| `objects.byName` | `OBJECTS`             | Parsed objects grouped by object name (`DICTIONARY`, `LAYOUT`, `MLEADERSTYLE`, `MLINESTYLE`, `GROUP`, `IMAGEDEF`, `PLOTSETTINGS`, `SPATIAL_FILTER`, `LAYER_FILTER`, `LAYER_INDEX`, `DIMASSOC`). Other object types are skipped. |
| `objects.byTree` | —                     | Declared in the type but currently always `undefined`. |
| `thumbnailImage` | `THUMBNAILIMAGE`      | Present only when the section exists (usually BMP data). |

## 2. Common entity fields

Every entity extends `CommonDxfEntity` (`src/parser/entities/shared.ts`). These
groups are recognised for all entity types.

| Field | TS type | Code | Default | Meaning |
| ----- | ------- | ---- | ------- | ------- |
| `type` | `string` | 0 | — | Entity type name, the discriminator (`'LINE'`, `'SHAPE'`, `'ACAD_TABLE'`, ...). |
| `handle` | `string` | 5 | generated | Entity handle. Files without handles (R12) get a generated numeric handle, see Parsing Notes in the README. |
| `ownerBlockRecordSoftId` | `string?` | 330 | — | Soft pointer to the owner: the BLOCK_RECORD of the space/block, or for SEQEND/VERTEX/ATTRIB the owning POLYLINE/INSERT. |
| `isInPaperSpace` | `boolean?` | 67 | — | `true` when in paper space. |
| `layer` | `string` | 8 | — | Layer name. |
| `layoutTabName` | `string?` | 410 | — | Layout tab name. |
| `lineType` | `string?` | 6 | — | Linetype name (absent = BYLAYER). |
| `materialObjectHardId` | `string?` | 347 | — | Hard pointer to a MATERIAL object. |
| `colorIndex` | `ColorIndex?` | 62 | — | ACI color (0 = BYBLOCK, 256 = BYLAYER). |
| `lineweight` | `number?` | 370 | — | Lineweight enum value. |
| `lineTypeScale` | `number?` | 48 | — | Linetype scale (DXF default 1, not filled in). |
| `isVisible` | `boolean?` | 60 | — | **Raw** boolean of code 60. DXF `60 = 1` means *invisible*, so `isVisible: true` means **hidden**. Absent when code 60 is not written (visible). |
| `proxyByte` | `number?` | 92, 160 | — | Byte count of proxy graphics. |
| `proxyEntity` | `string?` | 310 | — | Proxy graphics, all 310 chunks concatenated into one hex string. |
| `color` | `ColorInstance?` | 420 | — | True color (24-bit). No fallback from 62. |
| `colorName` | `string?` | 430 | — | Color name. |
| `transparency` | `number?` | 440 | — | Transparency value. |
| `plotStyleType` | `PlotStyleType?` | 380 | — | Plot style name type. |
| `plotStyleHardId` | `string?` | 390 | — | Hard pointer to plot style name object. |
| `shadowMode` | `ShadowMode?` | 284 | — | 0 cast+receive, 1 cast, 2 receive, 3 ignore. |
| `xdata` | `XData[]?` | 1001 + 1000..1071 | — | Extended data, one item per application (`{ appName, value }`). `1002 {`...`}` produce nested arrays; 1010-style points become `Point3D`. |
| `extensions` | `Record<string, ScannerGroup[]>?` | 102 | — | `{ACAD_XDICTIONARY`, `{ACAD_REACTORS` and other `{app` groups, keyed by name without `{`. The `102` brackets themselves are not included. Reactors appear as `{ code: 330, value: '<handle>' }` items. |

Most entity types also carry `subclassMarker` (the last `100` value read, or a
fixed string such as `'AcDbShape'`).

Common object fields (`CommonDXFObject`, `src/parser/objects/types.ts`):
`name` (object name, code 0), `handle` (5), `ownerObjectId` (330),
`extensions` (102 groups, as above).

## 3. Entity and object reference

### 3.1 MLEADERSTYLE (object)

- Exported type: `MLeaderStyleDXFObject` (`src/parser/objects/mleaderStyle/types.ts`)
- Discriminator: `name === 'MLEADERSTYLE'` (objects use `name`, not `type`)
- Location: `parsed.objects.byName.MLEADERSTYLE` (array)

**Finding a style.** The root `DICTIONARY` (owner `'0'`) has an entry
`ACAD_MLEADERSTYLE` pointing at a dictionary whose `entries` map style names to
style handles:

```ts
const dicts = parsed.objects.byName.DICTIONARY ?? []
const root = dicts.find((d) => d.ownerObjectId === '0')
const styleDictHandle = root.entries.find((e) => e.name === 'ACAD_MLEADERSTYLE')?.objectSoftId
const styleDict = dicts.find((d) => d.handle === styleDictHandle)
const handle = styleDict.entries.find((e) => e.name === 'Standard')?.objectSoftId
const style = parsed.objects.byName.MLEADERSTYLE.find((s) => s.handle === handle)
```

MULTILEADER entities reference their style by handle (`leaderStyleId`, code 340).
The style itself references: `leaderLineTypeId` (LTYPE), `arrowheadId` (BLOCK_RECORD,
`'0'` = default arrow), `textStyleId` (STYLE), `blockContentId` (BLOCK_RECORD).
`ownerObjectId` and the `ACAD_REACTORS` extension point to the
`ACAD_MLEADERSTYLE` dictionary.

All fields are optional except `subclassMarker`; no defaults are filled in.

| Field | TS type | Code | Meaning |
| ----- | ------- | ---- | ------- |
| `subclassMarker` | `'AcDbMLeaderStyle'` | 100 | Subclass marker |
| `unknown1` | `number` | 179 | Undocumented (AutoCAD writes 2) |
| `contentType` | `number` | 170 | 0 none, 1 block, 2 MText |
| `drawMLeaderOrderType` | `number` | 171 | Draw MLeader order |
| `drawLeaderOrderType` | `number` | 172 | Draw leader order |
| `maxLeaderSegmentPoints` | `number` | 90 | Max leader points |
| `firstSegmentAngleConstraint` | `number` | 40 | First segment angle |
| `secondSegmentAngleConstraint` | `number` | 41 | Second segment angle |
| `leaderLineType` | `number` | 173 | 0 invisible, 1 straight, 2 spline |
| `leaderLineColor` | `number` | 91 | Raw color value |
| `leaderLineTypeId` | `string` | 340 | LTYPE handle |
| `leaderLineWeight` | `number` | 92 | Lineweight |
| `landingEnabled` | `boolean` | 290 | Enable landing |
| `landingGap` | `number` | 42 | Landing gap |
| `doglegEnabled` | `boolean` | 291 | Enable dogleg |
| `doglegLength` | `number` | 43 | Dogleg length |
| `description` | `string` | 3 | Style description |
| `arrowheadId` | `string` | 341 | Arrow block record handle |
| `arrowheadSize` | `number` | 44 | Arrow size |
| `defaultMTextContents` | `string` | 300 | Default MText |
| `textStyleId` | `string` | 342 | STYLE handle |
| `textLeftAttachmentType` | `number` | 174 | Left attachment |
| `textAngleType` | `number` | 175 | Text angle type |
| `textAlignmentType` | `number` | 176 | Text alignment |
| `textRightAttachmentType` | `number` | 178 | Right attachment |
| `textColor` | `number` | 93 | Raw color value |
| `textHeight` | `number` | 45 | Text height |
| `textFrameEnabled` | `boolean` | 292 | Frame text |
| `textAlignAlwaysLeft` | `boolean` | 297 | Always left-align |
| `alignSpace` | `number` | 46 | Align space |
| `blockContentId` | `string` | 343 | Block content handle |
| `blockContentColor` | `number` | 94 | Raw color value |
| `blockContentScale` | `Point3D` | 47 / 49 / 140 | x / y / z scale |
| `blockContentScaleEnabled` | `boolean` | 293 | Enable block scale |
| `blockContentRotation` | `number` | 141 | Block rotation |
| `blockContentRotationEnabled` | `boolean` | 294 | Enable block rotation |
| `blockContentConnectionType` | `number` | 177 | Connection type |
| `scale` | `number` | 142 | Overall scale |
| `overwritePropertyValue` | `boolean` | 295 | Overwrite flag |
| `annotative` | `boolean` | 296 | Annotative |
| `breakGapSize` | `number` | 143 | Break gap |
| `textAttachmentDirection` | `number` | 271 | 0 horizontal, 1 vertical |
| `bottomTextAttachmentDirection` | `number` | 272 | 9 center, 10 underline+center |
| `topTextAttachmentDirection` | `number` | 273 | 9 center, 10 overline+center |
| `unknown2` | `boolean` | 298 | Undocumented (raw value, not converted) |
| `xdata` | `XData[]` | 1001 | e.g. `ACAD_MLEADERVER` |

Example (`sample/A_000217.dxf`):

```json
{
  "name": "MLEADERSTYLE",
  "handle": "D9B071D01A0C1AB8",
  "extensions": { "ACAD_REACTORS": [{ "code": 330, "value": "D9B071D01A0C1AB7" }] },
  "ownerObjectId": "D9B071D01A0C1AB7",
  "subclassMarker": "AcDbMLeaderStyle",
  "contentType": 2, "drawMLeaderOrderType": 1, "drawLeaderOrderType": 0,
  "maxLeaderSegmentPoints": 2,
  "firstSegmentAngleConstraint": 0, "secondSegmentAngleConstraint": 0,
  "leaderLineType": 1, "leaderLineColor": -1056964608,
  "leaderLineTypeId": "D9B071D01A0ACD2D", "leaderLineWeight": -2,
  "landingEnabled": true, "landingGap": 0.09,
  "doglegEnabled": true, "doglegLength": 0.36,
  "description": "Standard",
  "arrowheadId": "0", "arrowheadSize": 0.18,
  "defaultMTextContents": "",
  "textStyleId": "D9B071D01A0ACD2B",
  "textLeftAttachmentType": 1, "textRightAttachmentType": 6,
  "textAngleType": 1, "textAlignmentType": 0,
  "textColor": -1056964608, "textHeight": 0.18,
  "textFrameEnabled": false, "textAlignAlwaysLeft": false, "alignSpace": 0.18,
  "blockContentId": "0", "blockContentColor": -1056964608,
  "blockContentScale": { "x": 1, "y": 1, "z": 1 },
  "blockContentScaleEnabled": true, "blockContentRotation": 0,
  "blockContentRotationEnabled": true, "blockContentConnectionType": 0,
  "scale": 1, "overwritePropertyValue": false, "annotative": false,
  "breakGapSize": 0.125,
  "xdata": [{ "appName": "ACAD_MLEADERVER", "value": [2] }]
}
```

The dictionary that points at it (same file):

```json
{
  "name": "DICTIONARY", "handle": "D9B071D01A0C1AB7",
  "ownerObjectId": "D9B071D01A0ACD26",
  "subclassMarker": "AcDbDictionary", "recordCloneFlag": 1,
  "entries": [{ "name": "Standard", "objectSoftId": "D9B071D01A0C1AB8" }]
}
```

### 3.2 SHAPE

- Exported type: `ShapeEntity` (`src/parser/entities/shape/types.ts`)
- Discriminator: `type === 'SHAPE'`
- References: `shapeName` is a shape name inside a shape file (.shx) that is
  registered as a STYLE table entry with the shape-file flag. The parser does
  not resolve it. Owner via `ownerBlockRecordSoftId`.

| Field | TS type | Code | Default | Meaning |
| ----- | ------- | ---- | ------- | ------- |
| `subclassMarker` | `'AcDbShape'` | 100 | — | Subclass marker |
| `thickness` | `number` | 39 | `0` | Thickness |
| `insertionPoint` | `Point3D` | 10/20/30 | — | Insertion point |
| `size` | `number` | 40 | — | Size |
| `shapeName` | `string` | 2 | — | Shape name |
| `rotation` | `number` | 50 | `0` | Rotation angle (degrees) |
| `xScale` | `number` | 41 | `1` | Relative X scale |
| `obliqueAngle` | `number` | 51 | `0` | Oblique angle (degrees) |
| `extrusionDirection` | `Point3D` | 210/220/230 | `{x:0,y:0,z:1}` | Extrusion direction |

Example (`shape/tc0.partial_dxf`):

```json
{
  "handle": "19AAD3", "ownerBlockRecordSoftId": "19AA62", "layer": "0",
  "colorIndex": 7, "subclassMarker": "AcDbShape",
  "insertionPoint": { "x": 100, "y": 200, "z": 0 },
  "size": 2.5, "shapeName": "ARROW", "rotation": 45, "xScale": 1.5,
  "obliqueAngle": 10, "thickness": 0.5,
  "extrusionDirection": { "x": 0, "y": 0, "z": 1 },
  "type": "SHAPE"
}
```

### 3.3 SURFACE family

- Exported types (`src/parser/entities/surface/types.ts`): `SurfaceEntityBase`,
  `SurfaceEntity`, `PlaneSurfaceEntity`, `NurbSurfaceEntity`,
  `ExtrudedSurfaceEntity`, `SweptSurfaceEntity`, `RevolvedSurfaceEntity`,
  `LoftedSurfaceEntity`, `SweepOptions`, and the union `AnySurfaceEntity`.
- Discriminators: `'SURFACE'`, `'PLANESURFACE'`, `'NURBSURFACE'`,
  `'EXTRUDEDSURFACE'`, `'SWEPTSURFACE'`, `'REVOLVEDSURFACE'`, `'LOFTEDSURFACE'`.
- References: `historyObjectSoftId` (350) points to the history object;
  `materialObjectHardId` (347) to a MATERIAL. Swept / revolved / lofted
  profiles are embedded as binary blobs, not handles.
- No defaults are set for any surface field.

`subclassMarker` holds `'AcDbSurface'`; the subtype marker (e.g.
`'AcDbExtrudedSurface'`) goes to `surfaceSubclassMarker`. Binary data is a
`90` size followed by `310` chunks, which are concatenated into one hex string.
Matrices (`transform` etc.) are arrays of 16 numbers collected from repeated codes.

**Base fields (all 7 types)**

| Field | TS type | Code | Meaning |
| ----- | ------- | ---- | ------- |
| `version` | `number?` | 70 | Modeler format version (R2010 and before) |
| `data` | `string?` | 1 / 3 | ACIS data (absent in R2013+, stored in AcDsData) |
| `hasRevisionGuid` | `boolean?` | 290 | AcDbModelerGeometry flag |
| `guid` | `string?` | 2 | Revision GUID |
| `historyObjectSoftId` | `string?` | 350 | History object handle |
| `uIsolineCount` | `number` | 71 | U isolines |
| `vIsolineCount` | `number` | 72 | V isolines |

**PLANESURFACE**: `surfaceSubclassMarker?` (100, `'AcDbPlaneSurface'`), `classId?` (90).
**NURBSURFACE**: `surfaceSubclassMarker?` (100). **SURFACE**: base fields only.

**SweepOptions** (shared by EXTRUDEDSURFACE and SWEPTSURFACE, all optional)

| Field | Code | | Field | Code |
| ----- | ---- |-| ----- | ---- |
| `draftAngle` | 42 | | `isSolid` | 290 |
| `draftStartDistance` | 43 | | `sweepAlignment` | 70 (0 none, 1 align, 2 translate sweep, 3 translate path) |
| `draftEndDistance` | 44 | | `isAlignedToStart` | 292 |
| `twistAngle` | 45 | | `isBanked` | 293 |
| `scaleFactor` | 48 | | `isBasePointSet` | 294 |
| `alignAngle` | 49 | | `isSweepEntityTransformComputed` | 295 |
| `sweepEntityTransform` (`number[16]`) | 46 | | `isPathEntityTransformComputed` | 296 |
| `pathEntityTransform` (`number[16]`) | 47 | | `referenceVectorForTwist` (`Point3D`) | 11 |

**EXTRUDEDSURFACE** (+ SweepOptions)

| Field | TS type | Code |
| ----- | ------- | ---- |
| `classId` | `number` | 90 |
| `sweepEntityDataSize` / `sweepEntityData` | `number` / `string` | 90 + 310... |
| `sweepVector` | `Point3D` | 10 |
| `transform` | `number[]` | 40 (x16) |

**SWEPTSURFACE** (+ SweepOptions)

| Field | TS type | Code |
| ----- | ------- | ---- |
| `sweepEntityId` | `number` | 90 |
| `sweepEntityDataSize` / `sweepEntityData` | `number` / `string` | 90 + 310... |
| `pathEntityId` | `number` | 90 |
| `pathEntityDataSize` / `pathEntityData` | `number` / `string` | 90 + 310... |
| `sweepEntityTransformMatrix` | `number[]` | 40 (x16) |
| `pathEntityTransformMatrix` | `number[]` | 41 (x16) |

**REVOLVEDSURFACE**

| Field | TS type | Code |
| ----- | ------- | ---- |
| `revolveEntityId` | `number` | 90 |
| `revolveEntityDataSize` / `revolveEntityData` | `number` / `string` | 90 + 310... |
| `axisPoint` | `Point3D` | 10 |
| `axisVector` | `Point3D` | 11 |
| `revolveAngle` | `number` | 40 |
| `startAngle` | `number` | 41 |
| `transform` | `number[]` | 42 (x16) |
| `draftAngle`, `draftStartDistance`, `draftEndDistance`, `twistAngle` | `number?` | 43, 44, 45, 46 |
| `isSolid`, `isCloseToAxis` | `boolean?` | 290, 291 |

**LOFTEDSURFACE**

| Field | TS type | Code |
| ----- | ------- | ---- |
| `transform` | `number[]` | 40 (x16) |
| `entityData` | `{ size: number; data: string }[]?` | 90 + 310... (cross sections, guides, path) |
| `planeNormalLoftingType` | `number?` | 70 (0 none, 1 first, 2 last, 3 both, 4 all) |
| `startDraftAngle`, `endDraftAngle` | `number?` | 41, 42 |
| `startDraftMagnitude`, `endDraftMagnitude` | `number?` | 43, 44 |
| `isArcLengthParameterization`, `isNoTwist`, `isAlignDirection`, `isSimpleSurfaces`, `isClosed`, `isRuled`, `isVirtualGuide` | `boolean?` | 290, 291, 292, 293, 294, 295, 296 |

Example, plain SURFACE (`surface/tc0.partial_dxf`, xdata shortened):

```json
{
  "handle": "98E3FD", "ownerBlockRecordSoftId": "98E3F2", "layer": "HA-K",
  "materialObjectHardId": "663A6E", "colorIndex": 8,
  "proxyByte": 8, "proxyEntity": "0800000000000000",
  "hasRevisionGuid": true, "guid": "{91ca2de8-6656-0c49-9bcc-02ddcf2c8f71}",
  "subclassMarker": "AcDbSurface", "uIsolineCount": 6, "vIsolineCount": 6,
  "xdata": [{ "appName": "ACAD_STEPID", "value": [604] }],
  "type": "SURFACE"
}
```

Example, EXTRUDEDSURFACE and REVOLVEDSURFACE (`surface/tc1.partial_dxf`):

```json
[
  {
    "handle": "A1", "ownerBlockRecordSoftId": "1F", "layer": "0",
    "version": 1, "data": "ACISDATA",
    "subclassMarker": "AcDbSurface", "uIsolineCount": 2, "vIsolineCount": 3,
    "surfaceSubclassMarker": "AcDbExtrudedSurface", "classId": 17,
    "sweepEntityData": "AABBCCDD", "sweepEntityDataSize": 4,
    "sweepVector": { "x": 0, "y": 0, "z": 5 },
    "transform": [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
    "draftAngle": 0, "draftStartDistance": 0, "draftEndDistance": 0,
    "twistAngle": 0, "scaleFactor": 1, "alignAngle": 0,
    "sweepEntityTransform": [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    "pathEntityTransform": [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    "isSolid": false, "sweepAlignment": 2, "isAlignedToStart": true,
    "isBanked": false, "isBasePointSet": false,
    "isSweepEntityTransformComputed": true, "isPathEntityTransformComputed": true,
    "referenceVectorForTwist": { "x": 1, "y": 0, "z": 0 },
    "type": "EXTRUDEDSURFACE"
  },
  {
    "handle": "A2", "layer": "0",
    "hasRevisionGuid": false, "guid": "{00000000-0000-0000-0000-000000000000}",
    "subclassMarker": "AcDbSurface", "uIsolineCount": 0, "vIsolineCount": 0,
    "surfaceSubclassMarker": "AcDbRevolvedSurface",
    "revolveEntityId": 23, "revolveEntityData": "EEFF", "revolveEntityDataSize": 2,
    "axisPoint": { "x": 1, "y": 2, "z": 3 }, "axisVector": { "x": 0, "y": 0, "z": 1 },
    "revolveAngle": 3.14, "startAngle": 0.5,
    "transform": [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
    "draftAngle": 0, "draftStartDistance": 0, "draftEndDistance": 0, "twistAngle": 0,
    "isSolid": true, "isCloseToAxis": false,
    "type": "REVOLVEDSURFACE"
  }
]
```

### 3.4 SEQEND

- Exported type: `SeqendEntity` (`src/parser/entities/seqend/types.ts`)
- Discriminator: `type === 'SEQEND'`
- Fields: common entity fields only (plus `subclassMarker` if a `100` group is
  written). No defaults.
- References: `ownerBlockRecordSoftId` (330) is the handle of the POLYLINE
  (end of its VERTEX list) or INSERT (end of its ATTRIB list, when INSERT
  code 66 = 1) that owns the sequence. Nothing references a SEQEND.

Example (`seqend/tc0.partial_dxf`):

```json
{ "handle": "1A3", "ownerBlockRecordSoftId": "19F", "layer": "WALL", "type": "SEQEND" }
```

### 3.5 ACAD_TABLE

- Exported types (`src/parser/entities/table/types.ts`): `TableEntity`,
  `TableCell`, `TableCellValue`
- Discriminator: `type === 'ACAD_TABLE'`
- References: `tableStyleId` (342) TABLESTYLE object; `blockRecordHandle` (343)
  the anonymous `*T` BLOCK_RECORD holding the rendered geometry (also named by
  `name`, so `parsed.blocks[table.name]`); cell `blockTableRecordHandle` (340)
  block of a block cell; `attrDefHandles` (331) ATTDEFs; `fieldObjectId` (344)
  FIELD object.

**Header (`TableEntity`)**

| Field | TS type | Code | Default | Meaning |
| ----- | ------- | ---- | ------- | ------- |
| `subclassMarker` | `'AcDbTable'` | 100 | — | Subclass marker |
| `name` | `string` | 2 | — | Anonymous block name (`*T1`) |
| `startPoint` | `Point3D` | 10/20/30 | — | Insertion point |
| `version` | `number?` | 280 | — | Table data version |
| `tableStyleId` | `string?` | 342 | — | TABLESTYLE handle |
| `blockRecordHandle` | `string?` | 343 | — | Owning block record handle |
| `directionVector` | `Point3D?` | 11/21/31 | — | Horizontal direction |
| `tableValue` | `number?` | 90 | — | Flag for table value |
| `rowCount` | `number` | 91 | — | Rows |
| `columnCount` | `number` | 92 | — | Columns |
| `overrideFlag` | `number?` | 93 | — | Table override flag |
| `borderColorOverrideFlag` | `number?` | 94 | — | Border color override |
| `borderLineweightOverrideFlag` | `number?` | 95 | — | Border lineweight override |
| `borderVisibilityOverrideFlag` | `number?` | 96 | — | Border visibility override |
| `rowHeights` | `number[]` | 141 (repeated) | `[]` | Row heights |
| `columnWidths` | `number[]` | 142 (repeated) | `[]` | Column widths |
| `extrusionDirection` | `Point3D?` | 210 | — | Extrusion |
| `cells` | `TableCell[]` | from 171 | `[]` | Cells in row-major order (`rowCount * columnCount`) |

**Cell (`TableCell`)** — a new cell starts at each `171`. All fields except
`cellType` are optional.

| Field | Code | | Field | Code |
| ----- | ---- |-| ----- | ---- |
| `cellType` (1 text, 2 block) | 171 | | `textColor` | 64 |
| `flag` | 172 | | `backgroundColor` | 63 |
| `mergedValue` | 173 | | `isBackgroundFilled` | 283 |
| `autoFit` | 174 | | `top/right/bottom/leftBorderColor` | 69 / 65 / 66 / 68 |
| `borderWidth` (columns spanned) | 175 | | `top/right/bottom/leftBorderLineweight` | 279 / 275 / 276 / 278 |
| `borderHeight` (rows spanned) | 176 | | `top/right/bottom/leftBorderVisibility` | 289 / 285 / 286 / 288 |
| `overrideFlag` | 91 | | `extendedFlags` | 92 |
| `virtualEdgeFlag` | 178 | | `blockTableRecordHandle` | 340 |
| `rotation` | 145 | | `blockScale` | 144 |
| `fieldObjectId` | 344 | | `attrDefCount` | 179 |
| `text` (legacy; 2/3 chunks + 1) | 1 | | `attrDefHandles` (`string[]`) | 331 |
| `textStyle` | 7 | | `attrDefTexts` (`string[]`) | 300 |
| `textHeight` | 140 | | `value` (`TableCellValue`) | 301 ... 304 |
| `alignment` | 170 | | | |

**Cell value (`TableCellValue`)** — the `301 CELL_VALUE` ... `304 ACVALUE_END` block.

| Field | TS type | Code | Meaning |
| ----- | ------- | ---- | ------- |
| `flags` | `number?` | 93 | Value flags |
| `dataType` | `number?` | 90 | 0 unknown, 1 long, 2 double, 4 string, 8 date, 16 point2d, 32 point3d, 64 object id, 128 buffer, 256 result buffer, 512 general |
| `string` | `string?` | 2 chunks + 1 | String value |
| `double` | `number?` | 140 | Double value |
| `long` | `number?` | 91 | Long value |
| `point` | `Point3D?` | 11/21/31 | Point value |
| `unitType` | `number?` | 94 | Unit type |
| `formatString` | `string?` | 300 | Format string |
| `formattedValue` | `string?` | 302 | Display text |

Example (`table/tc0.partial_dxf`):

```json
{
  "handle": "29F", "ownerBlockRecordSoftId": "1F", "subclassMarker": "AcDbTable",
  "layer": "0", "colorIndex": 256, "name": "*T1",
  "startPoint": { "x": 408.2, "y": 340.8, "z": 0 },
  "version": 0, "tableStyleId": "28C", "blockRecordHandle": "28D",
  "directionVector": { "x": 1, "y": 0, "z": 0 },
  "tableValue": 0, "rowCount": 1, "columnCount": 3, "overrideFlag": 0,
  "borderColorOverrideFlag": 0, "borderLineweightOverrideFlag": 0,
  "borderVisibilityOverrideFlag": 0,
  "rowHeights": [7.5], "columnWidths": [30, 20, 10],
  "cells": [
    {
      "cellType": 1, "flag": 0, "mergedValue": 0, "autoFit": 0,
      "borderWidth": 2, "borderHeight": 1, "overrideFlag": 262201,
      "virtualEdgeFlag": 0, "rotation": 0, "textStyle": "Standard",
      "textHeight": 3.5, "alignment": 5, "textColor": 0, "extendedFlags": 0,
      "value": {
        "flags": 0, "dataType": 4, "string": "Hello-World", "unitType": 0,
        "formatString": "", "formattedValue": "Hello-World"
      }
    },
    {
      "cellType": 1, "flag": 0, "mergedValue": 1, "overrideFlag": 0,
      "isBackgroundFilled": true, "backgroundColor": 3,
      "value": { "flags": 3, "dataType": 0, "unitType": 0, "formatString": "", "formattedValue": "" }
    },
    {
      "cellType": 2, "flag": 0, "blockTableRecordHandle": "1A2", "blockScale": 1.5,
      "attrDefCount": 1, "attrDefHandles": ["1B3"], "attrDefTexts": ["ATTVAL"]
    }
  ],
  "type": "ACAD_TABLE"
}
```

### 3.6 TRACE

- Exported type: `TraceEntity` (`src/parser/entities/trace/types.ts`)
- Discriminator: `type === 'TRACE'`
- Same layout as SOLID. References: owner only.

| Field | TS type | Code | Default | Meaning |
| ----- | ------- | ---- | ------- | ------- |
| `subclassMarker` | `'AcDbTrace'` | 100 | — | Subclass marker |
| `points` | `Point3D[]` | 10-13 (+20-23, 30-33) | `[]` | Four corners, in file order |
| `thickness` | `number` | 39 | `0` | Thickness |
| `extrusionDirection` | `Point3D` | 210/220/230 | `{x:0,y:0,z:1}` | Extrusion direction |

Example (`trace/tc0.partial_dxf`):

```json
{
  "handle": "7147", "ownerBlockRecordSoftId": "7129", "layer": "NOI THAT",
  "lineweight": -1, "subclassMarker": "AcDbTrace", "thickness": 2.5,
  "points": [
    { "x": -0.0000014461311366, "y": 749.9999991504999, "z": 0 },
    { "x": -0.0000014461311366, "y": 719.9999991504999, "z": 0 },
    { "x": 929.9999985538689, "y": 749.9999991504999, "z": 0 },
    { "x": 929.9999985538689, "y": 719.9999991504999, "z": 0 }
  ],
  "extrusionDirection": { "x": 0, "y": 0, "z": -1 },
  "type": "TRACE"
}
```

## 4. Behaviour notes

- **SEQEND appears in `entities`.** SEQEND is now a parsed entity, so it shows
  up in `parsed.entities` and in `block.entities` after each POLYLINE vertex
  list and each INSERT attribute list. Code that iterates entities for drawing
  should skip `type === 'SEQEND'` (and use `ownerBlockRecordSoftId` if it needs
  to find the owner). `sample/A_000217.dxf` yields 116 SEQEND entities.
- **Lenient parsing.** Boolean group codes (290-299) whose value is not `0`/`1`
  become `true` when non-zero instead of throwing. A point whose `20` (y) group
  is missing gets `y = 0`. `ENDBLK` without `100 AcDbBlockEnd` (R12) still ends
  the block.
- **Unknown group codes.** When an entity or object contains a group code its
  parser does not know, parsing of that entity stops at that code: fields read
  so far are kept, the remaining groups of that entity are skipped, and the
  next entity is parsed normally. A field missing from the output can mean the
  code came after an unknown one.
- **`isVisible` is inverted.** See section 2: `true` means hidden.
