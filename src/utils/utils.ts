import { Coord } from '../types/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assert(condition: any, msg?: string): asserts condition is true {
  if (!condition) {
    throw new Error(msg || 'Assertion failed');
  }
}

export const compareCoord = (coord1: Coord, coord2: Coord) => {
  return coord1.x === coord2.x && coord1.y === coord2.y;
};
