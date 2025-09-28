import type { Point3D } from "../../../types";
import type { CommonDxfEntity } from "../shared";

export interface XLineEntity extends CommonDxfEntity {
	type: "XLINE";
	subclassMarker: "AcDbXline";
	/** Start point (in WCS) */
	firstPoint: Point3D;
	/** Unit direction vector (in WCS) */
	unitDirection: Point3D;
}
