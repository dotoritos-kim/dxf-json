/**
 * Determines plot style of new objects
 * 
 * This is defined aS $CEPSNTYPE in HEADER variables,
 * and it can be overridden in each entity by group code `380`
 */
export enum PlotStyleType {
  ByLayer = 0,
  ByBlock = 1,
  ByDictionaryDefault = 2,
  /** Plot style by object ID/handle */
  ByObject = 3,
}