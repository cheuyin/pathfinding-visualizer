import { NodeType } from '../../types/enums';
import { Grid } from '../../types/types';
import { Node } from '../../types/types';

/**
 * Runs the A Star algorithm on one node
 *
 * Returns false if the algorithm should stop
 *
 */
export const aStar = (grid: Grid): Grid | false => {
  let target: Node | null = null;

  for (const row of grid) {
    for (const node of row) {
      if (node.type === NodeType.TARGET) {
        target = node;
      }
    }
  }

  if (!target) {
    return false;
  }

  calculateHScores(grid, target);

  const unvisitedNodeWithLowestCost = findUnvisitedNodeWithLowestCost(grid);

  if (!unvisitedNodeWithLowestCost) {
    return false;
  }

  const unvisitedNeighbours: Node[] = findUnvisitedNeighbours(
    grid,
    unvisitedNodeWithLowestCost.x,
    unvisitedNodeWithLowestCost.y,
  );

  for (const n of unvisitedNeighbours) {
    const currDist = unvisitedNodeWithLowestCost.distance + 1;
    if (currDist < n.distance) {
      n.distance = currDist;
      n.prevNode = unvisitedNodeWithLowestCost;
    }
  }

  unvisitedNodeWithLowestCost.visited = true;

  return grid;
};

const findUnvisitedNodeWithLowestCost = (grid: Grid): Node | null => {
  let res: Node | null = null;

  for (const row of grid) {
    for (const node of row) {
      if (
        node.visited ||
        node.distance === Number.POSITIVE_INFINITY ||
        node.type === NodeType.WALL
      ) {
        continue;
      }
      if (!res || node.distance + node.hScore < res.distance + res.hScore) {
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

const calculateHScores = (grid: Grid, targetNode: Node) => {
  for (const row of grid) {
    for (const node of row) {
      node.hScore = calculateHScore(node, targetNode);
    }
  }
};

/**
 * The h-score is what differentiates A* from Dikstra's.
 *
 * This score will be added to the distance of each node.
 *
 * Thus, nodes that are closer to the target will be prioritized, all else equal.
 *
 * For this implementation of the h-score, I will be using Manhattan Distance
 *
 * Assumptions:
 * - Nodes can only move vertically or horizontally
 */
const calculateHScore = (currNode: Node, targetNode: Node) => {
  return Math.abs(targetNode.x - currNode.x) + Math.abs(targetNode.y - currNode.y);
};
