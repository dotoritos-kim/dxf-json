export enum ImageFlags {
  ShowImage = 1,
  ShowImageWhenNotAlignedWithScreen = 2,
  UseClippingBoundary = 4,
  TransparencyIsOn = 8,
}

export enum ImageClippingBoundaryType {
  Rectangular = 1,
  Polygonal = 2,
}

export enum ImageClipMode {
  Outside = 0,
  Inside = 1,
}