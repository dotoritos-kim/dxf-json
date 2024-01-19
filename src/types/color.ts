import type { ColorCode, UndeterminedBlockColor } from '../consts';

export type ColorIndex = ColorCode | number;

export type ColorInstance = typeof UndeterminedBlockColor | number;
