import type { Point3D } from '../../../types/shared.ts'
import type { CommonDxfEntity } from '../shared.ts'

/**
 * MULTILEADER entity fields mapped from AutoCAD DXF MLEADER group codes.
 *
 * References:
 * - https://help.autodesk.com/cloudhelp/2023/ENU/AutoCAD-DXF/files/GUID-69B9139A-48B4-48A5-B3CF-A3233ABFBE49.htm
 * - https://documentation.help/AutoCAD-DXF/WS1a9193826455f5ffc751fd10f4618e369-5bdf.htm
 */
export interface MultiLeaderEntity extends CommonDxfEntity {
  /**
   * Group code 0: entity type.
   * Expected value: `MULTILEADER`.
   */
  type: 'MULTILEADER'

  /**
   * Group code 100: subclass marker for this entity.
   * Expected value: `AcDbMLeader`.
   */
  subclassMarker?: 'AcDbMLeader'

  /**
   * Group code 270: MLeader version.
   */
  version?: number

  /**
   * Group code 340: leader style ID (handle reference).
   */
  leaderStyleId?: string

  /**
   * Group code 90: property override bit flags.
   */
  propertyOverrideFlag?: number

  /**
   * Group code 170: leader line type.
   */
  leaderLineType?: number

  /**
   * Group code 91: leader line color.
   */
  leaderLineColor?: number

  /**
   * Group code 341: leader line type ID (handle reference to linetype).
   */
  leaderLineTypeId?: string

  /**
   * Group code 171: leader line weight.
   */
  leaderLineWeight?: number

  /**
   * Group code 290: enable landing.
   * 0 = disabled, 1 = enabled.
   */
  landingEnabled?: boolean

  /**
   * Group code 291: enable dogleg.
   * 0 = disabled, 1 = enabled.
   */
  doglegEnabled?: boolean

  /**
   * Group code 41 (common MLeader code set): dogleg length.
   * Some files may also emit code 40 for dogleg-related length/constraint values.
   */
  doglegLength?: number

  /**
   * Group code 342: arrowhead ID (handle reference).
   */
  arrowheadId?: string

  /**
   * Group code 42: arrowhead size.
   */
  arrowheadSize?: number

  /**
   * Group code 172: content type (none / MText / block).
   */
  contentType?: number

  /**
   * Group code 343: text style ID (handle reference).
   */
  textStyleId?: string

  /**
   * Group code 173: text left attachment type.
   */
  textLeftAttachmentType?: number

  /**
   * Group code 95: text right attachment type.
   */
  textRightAttachmentType?: number

  /**
   * Group code 174: text angle type.
   */
  textAngleType?: number

  /**
   * Group code 175: text alignment type.
   */
  textAlignmentType?: number

  /**
   * Group code 92: text color in common MLeader data.
   * In CONTEXT_DATA, text color is stored as group code 90.
   */
  textColor?: number

  /**
   * Group code 292: enable text frame.
   * 0 = disabled, 1 = enabled.
   */
  textFrameEnabled?: boolean

  /**
   * Group code 145 in CONTEXT_DATA: landing gap.
   */
  landingGap?: number

  /**
   * Group code 171 in CONTEXT_DATA: text attachment mode.
   */
  textAttachment?: number

  /**
   * Group code 172 in CONTEXT_DATA: text flow direction.
   */
  textFlowDirection?: number

  /**
   * Group code 344 (common) / 341 (CONTEXT_DATA): block content ID.
   * Both are handle references to block definition/content.
   */
  blockContentId?: string

  /**
   * Group code 93: block content color.
   */
  blockContentColor?: number

  /**
   * Group code 10 (common MLeader code set): block content scale.
   * Parsed as Point3D by this project for XYZ scale components.
   */
  blockContentScale?: Point3D

  /**
   * Group code 43 (common MLeader code set): block content rotation.
   */
  blockContentRotation?: number

  /**
   * Group code 176: block content connection type.
   */
  blockContentConnectionType?: number

  /**
   * Group code 293: enable annotation scale.
   * 0 = disabled, 1 = enabled.
   */
  annotativeScaleEnabled?: boolean

  /**
   * Group code pair 94 + 345 (repeated):
   * 94 = arrowhead override index, 345 = arrowhead override handle.
   */
  arrowheadOverrides?: MultiLeaderIndexedHandle[]

  /**
   * Repeated block attribute override entries:
   * 330 = attribute ID handle, 177 = attribute index,
   * 44 = attribute width, 302 = attribute text.
   */
  blockAttributes?: MultiLeaderBlockAttribute[]

  /**
   * Group code 294: text direction negative flag.
   * 0 = false, 1 = true.
   */
  textDirectionNegative?: boolean

  /**
   * Group code 178: text align in IPE flag/value.
   */
  textAlignInIPE?: number

  /**
   * Group code 179: text attachment point.
   */
  textAttachmentPoint?: number

  /**
   * Group code 271: text attachment direction for MText content.
   * 0 = horizontal, 1 = vertical.
   */
  textAttachmentDirection?: number

  /**
   * Group code 272: bottom text attachment direction.
   * 9 = center, 10 = underline + center.
   */
  bottomTextAttachmentDirection?: number

  /**
   * Group code 273: top text attachment direction.
   * 9 = center, 10 = overline + center.
   */
  topTextAttachmentDirection?: number

  /**
   * CONTEXT_DATA group code 40: content scale.
   */
  contentScale?: number

  /**
   * CONTEXT_DATA group codes 10/20/30: content base position (X/Y/Z).
   */
  contentBasePosition?: Point3D

  /**
   * CONTEXT_DATA group codes 11/21/31: text normal direction vector.
   */
  normal?: Point3D

  /**
   * CONTEXT_DATA group codes 41 and 44 are both used for text height
   * in different MText layouts/variants.
   */
  textHeight?: number

  /**
   * CONTEXT_DATA group code 42: text rotation.
   */
  textRotation?: number

  /**
   * CONTEXT_DATA group code 43: text width.
   */
  textWidth?: number

  /**
   * CONTEXT_DATA group code 45: text line spacing factor.
   */
  textLineSpacingFactor?: number

  /**
   * CONTEXT_DATA group code 170: text line spacing style.
   */
  textLineSpacingStyle?: number

  /**
   * CONTEXT_DATA group codes 12/22/32: text location (anchor point).
   */
  textAnchor?: Point3D

  /**
   * CONTEXT_DATA group codes 13/23/33: text direction vector.
   */
  textDirection?: Point3D

  /**
   * CONTEXT_DATA group code 91: text background color.
   */
  textBackgroundColor?: number

  /**
   * CONTEXT_DATA group code 141: text background scale factor.
   */
  textBackgroundScaleFactor?: number

  /**
   * CONTEXT_DATA group code 92: text background transparency.
   */
  textBackgroundTransparency?: number

  /**
   * CONTEXT_DATA group code 291: text background color on/off.
   * 0 = false, 1 = true.
   */
  textBackgroundColorOn?: boolean

  /**
   * CONTEXT_DATA group code 292: text background fill on/off.
   * 0 = false, 1 = true.
   */
  textFillOn?: boolean

  /**
   * CONTEXT_DATA group code 173: text column type.
   */
  textColumnType?: number

  /**
   * CONTEXT_DATA group code 293: use text auto height.
   * 0 = false, 1 = true.
   */
  textUseAutoHeight?: boolean

  /**
   * CONTEXT_DATA group code 142: text column width.
   */
  textColumnWidth?: number

  /**
   * CONTEXT_DATA group code 143: text column gutter width.
   */
  textColumnGutterWidth?: number

  /**
   * CONTEXT_DATA group code 294: text column flow reversed.
   * 0 = false, 1 = true.
   */
  textColumnFlowReversed?: boolean

  /**
   * CONTEXT_DATA group code 144: text column height.
   */
  textColumnHeight?: number

  /**
   * CONTEXT_DATA group code 295: use word break for text columns.
   * 0 = false, 1 = true.
   */
  textUseWordBreak?: boolean

  /**
   * CONTEXT_DATA group code 304: default/actual text content.
   */
  textContent?: string

  /**
   * CONTEXT_DATA group code 290: has MText content flag.
   * 0 = false, 1 = true.
   */
  hasMText?: boolean

  /**
   * CONTEXT_DATA group code 296: has block content flag.
   * 0 = false, 1 = true.
   */
  hasBlock?: boolean

  /**
   * CONTEXT_DATA block content bundle:
   * - 341 block content ID
   * - 14/24/34 normal
   * - 15/25/35 position
   * - 16 scale
   * - 46 rotation
   * - 93 color
   * - 47 transformation matrix (repeated)
   */
  blockContent?: {
    /**
     * CONTEXT_DATA group code 341: block content ID (handle reference).
     */
    blockContentId?: string

    /**
     * CONTEXT_DATA group codes 14/24/34: block content normal direction.
     */
    normal?: Point3D

    /**
     * CONTEXT_DATA group codes 15/25/35: block content position.
     */
    position?: Point3D

    /**
     * CONTEXT_DATA group code 16 (+ implied 26/36): block content scale.
     */
    scale?: Point3D

    /**
     * CONTEXT_DATA group code 46: block content rotation.
     */
    rotation?: number

    /**
     * CONTEXT_DATA group code 93: block content color.
     */
    color?: number

    /**
     * CONTEXT_DATA group code 47 (repeated): block transformation matrix data.
     */
    transformationMatrix?: number[]
  }

  /**
   * CONTEXT_DATA group codes 110/120/130: MLeader plane origin point.
   */
  planeOrigin?: Point3D

  /**
   * CONTEXT_DATA group codes 111/121/131: MLeader plane X-axis direction.
   */
  planeXAxisDirection?: Point3D

  /**
   * CONTEXT_DATA group codes 112/122/132: MLeader plane Y-axis direction.
   */
  planeYAxisDirection?: Point3D

  /**
   * CONTEXT_DATA group code 297: plane normal reversed flag.
   * 0 = false, 1 = true.
   */
  planeNormalReversed?: boolean

  /**
   * CONTEXT_DATA nested LEADER sections.
   * Starts at code 302 = "LEADER{" and ends at code 303 = "}".
   */
  leaderSections?: MultiLeaderLeaderSection[]
}

export interface MultiLeaderLeaderSection {
  /**
   * Leader Node group codes 10/20/30: last leader line point.
   */
  lastLeaderLinePoint?: Point3D

  /**
   * Leader Node group code 290: whether last leader line point is set.
   * 0 = false, 1 = true.
   */
  lastLeaderLinePointSet?: boolean

  /**
   * Leader Node group codes 11/21/31: dogleg vector.
   */
  doglegVector?: Point3D

  /**
   * Leader Node group code 291: whether dogleg vector is set.
   * 0 = false, 1 = true.
   */
  doglegVectorSet?: boolean

  /**
   * Leader Node group code 40: dogleg length.
   */
  doglegLength?: number

  /**
   * Leader Node break segments:
   * 12/22/32 = break start point, 13/23/33 = break end point.
   */
  breaks?: MultiLeaderBreak[]

  /**
   * Leader Node group code 90: leader branch index.
   */
  leaderBranchIndex?: number

  /**
   * Nested LEADER_LINE blocks in this leader section.
   * Starts at code 304 = "LEADER_LINE{" and ends at code 305 = "}".
   */
  leaderLines: MultiLeaderLeaderLine[]
}

export interface MultiLeaderLeaderLine {
  /**
   * Leader Line group codes 10/20/30 (repeated): vertex coordinates.
   */
  vertices: Point3D[]

  /**
   * Leader Line group code 90 (repeated): break point index list.
   */
  breakPointIndexes?: number[]

  /**
   * Leader Line group code 91: leader line index.
   */
  leaderLineIndex?: number

  /**
   * Leader Line break segments:
   * 11/21/31 = break start point, 12/22/32 = break end point.
   */
  breaks?: MultiLeaderBreak[]
}

export interface MultiLeaderBreak {
  /**
   * Group code 90 in LEADER_LINE context: break point index.
   */
  index?: number

  /**
   * Break start point:
   * - Leader Node: group codes 12/22/32
   * - Leader Line: group codes 11/21/31
   */
  start: Point3D

  /**
   * Break end point:
   * - Leader Node: group codes 13/23/33
   * - Leader Line: group codes 12/22/32
   */
  end: Point3D
}

export interface MultiLeaderIndexedHandle {
  /**
   * Group code 94: override entry index.
   */
  index: number

  /**
   * Group code 345: override handle reference.
   */
  handle: string
}

export interface MultiLeaderBlockAttribute {
  /**
   * Group code 330: block attribute ID handle.
   */
  id?: string

  /**
   * Group code 177: block attribute index.
   */
  index?: number

  /**
   * Group code 44: block attribute width.
   */
  width?: number

  /**
   * Group code 302: block attribute text string.
   */
  text?: string
}
