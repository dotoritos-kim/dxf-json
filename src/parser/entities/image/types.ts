import type { Point2D, Point3D } from "../../../types";
import type { CommonDxfEntity } from "../shared";
import type { ImageClipMode, ImageClippingBoundaryType } from "./consts";

export enum ImageFlags {
	ShowImage = 1,
	ShowImageWhenNotAlignedWithScreen = 2,
	UseClippingBoundary = 4,
	TransparencyIsOn = 8,
}

export interface ImageEntity extends CommonDxfEntity {
	type: "IMAGE";
	subclassMarker: "AcDbRasterImage";
	/** Class version */
	version: number;
	/** Insertion point (in WCS) */
	position: Point3D;
	/**
	 * U-vector of a single pixel (points along the visual bottom of the image,
	 * starting at the insertion point) (in WCS)
	 * */
	uPixel: Point3D;
	/**
	 * V-vector of a single pixel (points along the visual left side of the image,
	 * starting at the insertion point) (in WCS)
	 * */
	vPixel: Point3D;
	/** Image size in pixels */
	imageSize: Point2D;
	/** Hard reference to imagedef object */
	imageDefHandle: string;
	/**
	 * Image display properties
	 * @see {import("./consts").ImageFlags}
	 * */
	flags: number;
	/** Clipping state. `true` if it's clipping state is ON, `false` when OFF */
	isClipped: boolean;
	/** Brightness value (0-100; default = 50) */
	brightness: number;
	/** Contrast value (0-100; default = 50) */
	contrast: number;
	/** Fade value (0-100; default = 0) */
	fade: number;
	/** Hard reference to imagedef_reactor object */
	imageDefReactorHandle: string;
	/** Clipping boundary type */
	clippingBoundaryType: ImageClippingBoundaryType;
	/** Number of clip boundary vertices that follow */
	countBoundaryPoints: number;
	/**
	 * Clip boundary vertex (in OCS)
	 * @note
	 * 1. For rectangular clip boundary type, two opposite corners must be specified.
	 *    Default is (-0.5,-0.5), (size.x-0.5, size.y-0.5).
	 * 2. For polygonal clip boundary type, three or more vertices must be specified.
	 *    Polygonal vertices must be listed sequentially
	 * */
	clippingBoundaryPath: Point2D[];
	clipMode: ImageClipMode;
}
