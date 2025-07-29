import type { ColorIndex, ColorInstance } from "../types/color";
import AUTO_CAD_COLOR_INDEX from './AutoCadColorIndex';

/**
 * Returns the truecolor value of the given AutoCad color index value
 * @param index
 * @return truecolor value as a number
 */
export function getAcadColor(index: ColorIndex): ColorInstance {
  return AUTO_CAD_COLOR_INDEX[index];
}