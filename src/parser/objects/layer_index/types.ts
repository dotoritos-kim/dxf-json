import type { CommonDXFObject } from '../types.ts'

/**
 * LAYER_INDEX object fields mapped from AutoCAD DXF group codes.
 *
 * Reference:
 * https://help.autodesk.com/cloudhelp/2024/ENU/AutoCAD-DXF/files/GUID-17560B05-31B9-44A5-BA92-E92C799398C0.htm
 */
export interface LayerIndexDXFObject extends CommonDXFObject {
  /**
   * Group code 100: base subclass marker for index objects.
   * Expected value: `AcDbIndex`.
   */
  indexSubclassMarker: 'AcDbIndex'

  /**
   * Group code 40: time stamp stored as a Julian date number.
   */
  timeStamp: number

  /**
   * Group code 100: subclass marker for this object.
   * Expected value: `AcDbLayerIndex`.
   */
  subclassMarker: 'AcDbLayerIndex'

  /**
   * Group code 8 (repeated): layer names included in this layer index.
   * Multiple entries may exist in one LAYER_INDEX object.
   */
  layerNames?: string[]

  /**
   * Group code 360 (repeated): hard-owner handles to IDBUFFER objects.
   * Each entry points to one IDBUFFER referenced by this layer index.
   */
  idBufferIds?: string[]

  /**
   * Group code 90 (repeated): number of entries in the IDBUFFER list.
   * Multiple entries may exist in one LAYER_INDEX object.
   */
  idBufferEntryCounts?: number[]
}
