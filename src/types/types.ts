import { NodeState } from './enums';

export interface Node {
  id: string;
  x: number;
  y: number;
  prevNode: Node | null;
  distance: number;
  type: NodeState;
  visited: boolean;
}

export type Grid = Node[][];
