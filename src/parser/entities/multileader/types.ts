import type { Point3D } from "../../../types"; 
import type { CommonDxfEntity } from "../shared";

export interface MultiLeaderEntity extends CommonDxfEntity {
	type: "MULTILEADER";
	multileaderType: number;
	doglegEnabled: boolean;
	doglegLength: number;
	contentType: number;
	landingPoint?: Point3D;
	doglegVector?: Point3D;
	textContent?: {
		text: string;
		anchorPoint: Point3D;
	};
	blockContent?: {
		blockHandle: string;
		position: Point3D;
	};
	leaders?: MultiLeaderLeaderSection[];
}

export interface MultiLeaderLeaderSection {
	landingPoint?: Point3D;
	doglegVector?: Point3D;
	doglegLength?: number;
	leaderLines: MultiLeaderLeaderLine[];
}

export interface MultiLeaderLeaderLine {
	vertices: Point3D[];
	breaks?: MultiLeaderBreak[];
}

export interface MultiLeaderBreak {
	start: Point3D;
	end: Point3D;
}
