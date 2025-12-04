export enum TableEntryDependencyFlag {
  /**
   * If set, table entry is externally dependent on an xref
   */
  XrefDependent = 16,
  /**
   * If both this bit and bit 16 are set, the externally dependent xref
   * has been successfully resolved
   * */
  XrefResolved = 32,
  /**
   * If set, the table entry was referenced by at least one entity in the
   * drawing the last time the drawing was edited.
   *
   * This flag is for the benefit of AutoCAD commands. It can be ignored
   * by most programs that read DXF files and need not be set by programs
   * that write DXF files.
   */
  Referenced = 64,
}
