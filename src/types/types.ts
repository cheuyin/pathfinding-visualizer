import { NodeState } from './enums';

export interface Node {
  prevCell: Node | null;
  weight: number;
  type: NodeState;
}
