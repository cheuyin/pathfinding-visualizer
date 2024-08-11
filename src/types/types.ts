import { NodeState } from './enums';

export interface Node {
  prevCell: Node | null;
  distance: number;
  type: NodeState;
}

export type Grid = Node[][];
