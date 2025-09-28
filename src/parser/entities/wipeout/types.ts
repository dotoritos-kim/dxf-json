import type { ImageEntity } from "../image";

export type WipeoutEntity = ImageEntity & {
	type: "WIPEOUT";
};
