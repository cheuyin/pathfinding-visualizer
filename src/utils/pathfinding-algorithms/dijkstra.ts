import { NodeType } from '../../types/enums';
import { Grid } from '../../types/types';
import { Node } from '../../types/types';

/**
 * Runs Dijkstra's algorithm on one node
 * Returns new Grid object
 *
 * Returns false if the algorithm should stop
 *
 */
export const dijkstra = (grid: Grid): Grid | false => {
  const newGrid = grid.map((row) => row.map((node) => ({ ...node })));

  const unvisitedNodeWithShortestDistance = findUnvisitedNodeWithShortestDistance(newGrid);

  if (!unvisitedNodeWithShortestDistance) {
    return false;
  }

  const unvisitedNeighbours: Node[] = findUnvisitedNeighbours(
    newGrid,
    unvisitedNodeWithShortestDistance.x,
    unvisitedNodeWithShortestDistance.y,
  );

  for (const n of unvisitedNeighbours) {
    const currDist = unvisitedNodeWithShortestDistance.distance + 1;
    if (currDist < n.distance) {
      n.distance = currDist;
      n.prevNode = unvisitedNodeWithShortestDistance;
    }
  }

  unvisitedNodeWithShortestDistance.visited = true;

  return newGrid;
};

const findUnvisitedNodeWithShortestDistance = (grid: Grid): Node | null => {
  let res: Node | null = null;

  for (const row of grid) {
    for (const node of row) {
      if (node.visited || node.distance === Number.POSITIVE_INFINITY) {
        continue;
      }
      if (!res || node.distance < res.distance) {
        res = node;
      }
    }
  }

  return res;
};

const findUnvisitedNeighbours = (grid: Grid, nodeX: number, nodeY: number): Node[] => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const unvisitedNeighbours: Node[] = [];

  if (nodeX > 0) {
    const n = grid[nodeY][nodeX - 1];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  if (nodeX < numCols - 1) {
    const n = grid[nodeY][nodeX + 1];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  if (nodeY > 0) {
    const n = grid[nodeY - 1][nodeX];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  if (nodeY < numRows - 1) {
    const n = grid[nodeY + 1][nodeX];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  return unvisitedNeighbours;
};
