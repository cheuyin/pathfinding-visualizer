import { dijkstra } from './dijkstra';
import { aStar } from './a-star';
import { dfs } from './dfs';
import { Algorithm } from '@/types/types';

// Keep Algorithm value types while preserving a literal union of the keys
export const PathfindingAlgorithmRegistry = {
  "Dijkstra's": dijkstra,
  'A*': aStar,
  DFS: dfs,
} as const satisfies Record<string, Algorithm>;
