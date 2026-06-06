import type { CommonDXFObject } from '../types.ts'

/**
 * LAYER_FILTER object fields mapped from AutoCAD DXF group codes.
 *
 * Reference:
 * https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-DXF/files/GUID-3B44DCFD-FA96-482B-8468-37B3C5B5F289.htm
 */
export interface LayerFilterDXFObject extends CommonDXFObject {
  /**
   * Group code 100: base subclass marker for filter objects.
   * Expected value: `AcDbFilter`.
   */
  filterSubclassMarker: 'AcDbFilter'

  /**
   * Group code 100: subclass marker for this object.
   * Expected value: `AcDbLayerFilter`.
   */
  subclassMarker: 'AcDbLayerFilter'

  /**
   * Group code 8 (repeated): layer names included in this filter.
   * Multiple entries may exist in a single LAYER_FILTER object.
   */
  layerNames?: string[]
}
