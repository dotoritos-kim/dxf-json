import type { ColorCode, UndeterminedBlockColor } from '../consts/color.ts'


export type ColorIndex = ColorCode | number;

export type ColorInstance = typeof UndeterminedBlockColor | number;
