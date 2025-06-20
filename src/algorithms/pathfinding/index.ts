import { dijkstra } from './dijkstra';
import { aStar } from './aStar';
import { dfs } from './dfs';
import { Algorithm } from '@/types/types';

export const PathfindingAlgorithmRegistry: Record<string, Algorithm> = {
  "Dijkstra's": dijkstra,
  'A*': aStar,
  DFS: dfs,
} as const;
