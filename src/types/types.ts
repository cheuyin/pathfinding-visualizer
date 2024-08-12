import { NodeType } from './enums';

export interface Node {
  id: string;
  x: number;
  y: number;
  prevNode: Node | null;
  distance: number;
  type: NodeType;
  visited: boolean;
  hScore: number;
}

export type Grid = Node[][];

export type Algorithm = (grid: Grid) => Grid | false;
