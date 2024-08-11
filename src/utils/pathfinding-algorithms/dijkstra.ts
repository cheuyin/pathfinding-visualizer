import { Grid } from '../../types/types';
import { Node } from '../../types/types';

/**
 * Runs Dijkstra's algorithm on one node
 * Returns new Grid object
 *
 */
export const dijkstra = (grid: Grid): Grid => {
  const newGrid = grid.map((row) => [...row]);

  const nodeWithShortestDistance = findUnvisitedNodeWithShortestDistance(newGrid);

  if (!nodeWithShortestDistance) {
    return newGrid;
  }

  const unvisitedNeighbours: Node[] = findUnvisitedNeighbours(
    newGrid,
    nodeWithShortestDistance.x,
    nodeWithShortestDistance.y,
  );

  for (const n of unvisitedNeighbours) {
    const currDist = nodeWithShortestDistance.distance + 1;
    if (currDist < n.distance) {
      n.distance = currDist;
      n.prevNode = nodeWithShortestDistance;
    }
  }

  nodeWithShortestDistance.visited = true;

  return newGrid;
};

const findUnvisitedNodeWithShortestDistance = (grid: Grid): Node | null => {
  let res: Node | null = null;

  for (const row of grid) {
    for (const node of row) {
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
    const n = grid[nodeX - 1][nodeY];
    if (!n.visited) unvisitedNeighbours.push(n);
  }

  if (nodeX < numCols - 1) {
    const n = grid[nodeX + 1][nodeY];
    if (!n.visited) unvisitedNeighbours.push(n);
  }

  if (nodeY > 0) {
    const n = grid[nodeX][nodeY - 1];
    if (!n.visited) unvisitedNeighbours.push(n);
  }

  if (nodeY < numRows - 1) {
    const n = grid[nodeX][nodeY + 1];
    if (!n.visited) unvisitedNeighbours.push(n);
  }

  return unvisitedNeighbours;
};
