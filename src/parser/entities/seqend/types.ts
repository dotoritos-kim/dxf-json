import type { CommonDxfEntity } from '../shared.ts'

/**
 * SEQEND marks the end of a complex entity sequence:
 * the VERTEX list of a POLYLINE, or the ATTRIB list of an INSERT
 * (when INSERT group code 66 is 1).
 * It carries only common entity groups; `ownerBlockRecordSoftId` (330)
 * points to the POLYLINE/INSERT that owns the sequence.
 */
export interface SeqendEntity extends CommonDxfEntity {
  type: 'SEQEND'
}
