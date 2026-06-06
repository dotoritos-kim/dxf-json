import type { Point3D } from '../../../types/shared.ts'
import type { CommonDXFObject } from '../types.ts'

/**
 * MLEADERSTYLE object fields mapped from AutoCAD DXF group codes.
 *
 * Reference:
 * https://help.autodesk.com/cloudhelp/2016/ENU/AutoCAD-DXF/files/GUID-0E489B69-17A4-4439-8505-9DCE032100B4.htm
 */
export interface MLeaderStyleDXFObject extends CommonDXFObject {
  /**
   * Group code 100: subclass marker for this object.
   * Expected value: `AcDbMLeaderStyle`.
   */
  subclassMarker: 'AcDbMLeaderStyle'

  /**
   * Group code 179: undocumented value observed in AutoCAD-generated
   * MLEADERSTYLE objects.
   */
  unknown1?: number

  /**
   * Group code 170: content type used by this MLeader style.
   */
  contentType?: number

  /**
   * Group code 171: draw MLeader order type.
   */
  drawMLeaderOrderType?: number

  /**
   * Group code 172: draw leader order type.
   */
  drawLeaderOrderType?: number

  /**
   * Group code 90: max leader segment points.
   */
  maxLeaderSegmentPoints?: number

  /**
   * Group code 40: first segment angle constraint.
   */
  firstSegmentAngleConstraint?: number

  /**
   * Group code 41: second segment angle constraint.
   */
  secondSegmentAngleConstraint?: number

  /**
   * Group code 173: leader line type.
   */
  leaderLineType?: number

  /**
   * Group code 91: leader line color.
   */
  leaderLineColor?: number

  /**
   * Group code 340: leader line type ID (handle reference).
   */
  leaderLineTypeId?: string

  /**
   * Group code 92: leader line weight.
   */
  leaderLineWeight?: number

  /**
   * Group code 290: enable landing.
   * 0 = disabled, 1 = enabled.
   */
  landingEnabled?: boolean

  /**
   * Group code 42: landing gap.
   */
  landingGap?: number

  /**
   * Group code 291: enable dogleg.
   * 0 = disabled, 1 = enabled.
   */
  doglegEnabled?: boolean

  /**
   * Group code 43: dogleg length.
   */
  doglegLength?: number

  /**
   * Group code 3: MLeader style description.
   */
  description?: string

  /**
   * Group code 341: arrowhead ID (handle reference).
   */
  arrowheadId?: string

  /**
   * Group code 44: arrowhead size.
   */
  arrowheadSize?: number

  /**
   * Group code 300: default MText contents.
   */
  defaultMTextContents?: string

  /**
   * Group code 342: MText style ID (handle reference).
   */
  textStyleId?: string

  /**
   * Group code 174: text left attachment type.
   */
  textLeftAttachmentType?: number

  /**
   * Group code 175: text angle type.
   */
  textAngleType?: number

  /**
   * Group code 176: text alignment type.
   */
  textAlignmentType?: number

  /**
   * Group code 178: text right attachment type.
   */
  textRightAttachmentType?: number

  /**
   * Group code 93: text color.
   */
  textColor?: number

  /**
   * Group code 45: text height.
   */
  textHeight?: number

  /**
   * Group code 292: enable frame text.
   * 0 = disabled, 1 = enabled.
   */
  textFrameEnabled?: boolean

  /**
   * Group code 297: text align always left.
   * 0 = false, 1 = true.
   */
  textAlignAlwaysLeft?: boolean

  /**
   * Group code 46: align space.
   */
  alignSpace?: number

  /**
   * Group code 343: block content ID (handle reference).
   */
  blockContentId?: string

  /**
   * Group code 94: block content color.
   */
  blockContentColor?: number

  /**
   * Group codes 47/49/140: block content scale on X/Y/Z axes.
   * 47 = X, 49 = Y, 140 = Z.
   */
  blockContentScale?: Point3D

  /**
   * Group code 293: enable block content scale.
   * 0 = disabled, 1 = enabled.
   */
  blockContentScaleEnabled?: boolean

  /**
   * Group code 141: block content rotation.
   */
  blockContentRotation?: number

  /**
   * Group code 294: enable block content rotation.
   * 0 = disabled, 1 = enabled.
   */
  blockContentRotationEnabled?: boolean

  /**
   * Group code 177: block content connection type.
   */
  blockContentConnectionType?: number

  /**
   * Group code 142: scale.
   */
  scale?: number

  /**
   * Group code 295: overwrite property value flag.
   * 0 = false, 1 = true.
   */
  overwritePropertyValue?: boolean

  /**
   * Group code 296: annotative flag.
   * 0 = non-annotative, 1 = annotative.
   */
  annotative?: boolean

  /**
   * Group code 143: break gap size.
   */
  breakGapSize?: number

  /**
   * Group code 271: text attachment direction for MText content.
   * 0 = horizontal, 1 = vertical.
   */
  textAttachmentDirection?: number

  /**
   * Group code 272: bottom text attachment direction.
   * 9 = center, 10 = underline and center.
   */
  bottomTextAttachmentDirection?: number

  /**
   * Group code 273: top text attachment direction.
   * 9 = center, 10 = overline and center.
   */
  topTextAttachmentDirection?: number

  /**
   * Group code 298: undocumented flag observed in AutoCAD-generated
   * MLEADERSTYLE objects.
   */
  unknown2?: boolean
}
