export enum RecordCloneFlag {
    /** Not applicable: Unrelated to duplication */
    NOT_APPLICABLE = 0,
    /** Keep existing: When collided, keep previousely existed one and ignore cloned one */
    KEEP_EXISTING = 1,
    /** Use clone: When collided, use cloned one and ignore previousely existed one */
    USE_CLONE = 2,
    /** Change cloned name into <xref>$0$<name> */
    XREF_VALUE_NAME = 3,
    /** Change cloned name into $0$<name> */
    VALUE_NAME = 4,
    /** Unmangle name: Just use collided name- it maybe dangerous */
    UNMANGLE_NAME = 5,
}