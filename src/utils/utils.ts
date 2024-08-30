import { NodeType } from '../types/enums';
import { Coord, Node } from '../types/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assert(condition: any, msg?: string): asserts condition is true {
  if (!condition) {
    throw new Error(msg || 'Assertion failed');
  }
}

export const compareCoord = (coord1: Coord, coord2: Coord) => {
  return coord1.x === coord2.x && coord1.y === coord2.y;
};

export const paintCell = (node: Node) => {
  const gridCell = document.getElementById(`GridCell-${node.x}-${node.y}`);
  if (!gridCell) return;

  let colourClass: string | null = null;

  switch (node.type) {
    case NodeType.SOURCE:
      colourClass = 'GridCell--source';
      break;
    case NodeType.TARGET:
      colourClass = 'GridCell--target';
      break;
    case NodeType.PATH:
      colourClass = 'GridCell--path';
      break;
    case NodeType.WALL:
      colourClass = 'GridCell--wall';
      break;
    case NodeType.VISITED:
      colourClass = 'GridCell--visited';
      break;
    default:
      colourClass = null;
  }

  gridCell.className = `${'GridCell'} ${colourClass}`;
};
