export interface DxfClass {
  /**
   * Name of the Class DXF record.
   *
   * It's always unique.
   *
   * Parsed by group code `1`
   * */
  name: string
  /**
   * C++ class name.
   * Used to bind with software that defines object class behavior.
   *
   * It's always unique.
   *
   * Parsed by group code `2`
   */
  cppClassName: string
  /**
   * Application name. Posted in Alert box when a class definition
   * listed in this section is not currently loaded.
   *
   * Parsed by group code `3`
   */
  appName: string
  /**
   * Bit-coded flag indicates the capabilities of this object as proxy.
   *
   * Parsed by group code `90`
   *
   * @see ProxyCapabilityFlag
   */
  proxyFlag: number
  /**
   * Instance count for a custom class
   *
   * Parsed by group code `91`
   */
  instanceCount: number
  /**
   * Indicates whether this class was proxy.
   *
   * - `true`  if class was not loaded when this DXF file was created.
   * - `false` otherwise.
   *
   * Parsed by group code `280`
   */
  wasProxy: boolean
  /**
   * Indicates whether this class is an entity.
   *
   * - `true` if class was derived from `AcDbEntity` class, and can be included
   * in `BLOCKS` and `ENTITIES` sections.
   * - `false` otherwise.
   *
   * Parsed by group code `281`
   */
  isEntity: boolean
}
