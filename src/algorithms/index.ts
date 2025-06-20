import { dijkstra } from './pathfinding/dijkstra';
import { aStar } from './pathfinding/aStar';
import { dfs } from './pathfinding/dfs';
import { recursiveBacktracking } from './maze/recursiveBacktracking';
import { Algorithm } from '@/types/types';

export const AlgorithmRegistry: Record<string, Algorithm> = {
    "Dijkstra's": dijkstra,
    'A*': aStar,
    DFS: dfs,
    'Recursive Backtracking Maze': recursiveBacktracking,
}; 