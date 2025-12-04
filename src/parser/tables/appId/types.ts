import type { CommonDxfTableEntry } from '../types.ts'

export interface AppIdTableEntry extends CommonDxfTableEntry {
  subclassMarker: 'AcDbRegAppTableRecord'
  /**
   * User-supplied (or application-supplied) application name (for extended data).
   * These table entries maintain a set of names for all registered applications.
   *
   * Parsed by group code `2`.
   */
  appName: string
  /**
   * Bitwise combination of `TableEntryDependencyFlag` which indicates xref status.
   *
   * Parsed by group code `70`.
   *
   * @see TableEntryDependencyFlag
   */
  flag: number
}
