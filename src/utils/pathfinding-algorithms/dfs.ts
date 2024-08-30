import { NodeType } from '../../types/enums';
import { Algorithm, Coord, Grid } from '../../types/types';
import { Node } from '../../types/types';

interface DFSNode extends Node {
  visited: boolean;
  prevCoord: Coord | null;
}

type DFSGrid = DFSNode[][];

export const dfs: Algorithm = (grid: Grid, sourceCoord: Coord, targetCoord: Coord) => {
  const dfsGrid: DFSNode[][] = grid.map((row) =>
    row.map((node) => {
      return {
        ...node,
        visited: false,
        prevCoord: null,
      };
    }),
  );

  const visited: Coord[] = [];
  let pathToTarget: Coord[] = [];

  const stack: Coord[] = [];
  stack.push(sourceCoord);

  while (stack.length) {
    const currCoord = stack.pop()!;
    const currNode = dfsGrid[currCoord.y][currCoord.x];

    if (currNode.visited) continue;

    currNode.visited = true;
    visited.push(currCoord);

    if (currNode.type === NodeType.TARGET) {
      pathToTarget = buildPathToTarget(dfsGrid, targetCoord);
      break;
    }

    const neighbours = findUnvisitedNeighbours(dfsGrid, currCoord);

    if (neighbours.length === 0) {
      continue;
    }

    for (const n of neighbours) {
      const neighbourNode = dfsGrid[n.y][n.x];
      neighbourNode.prevCoord = currCoord;
      stack.push(n);
    }
  }

  return {
    visitedNodes: visited,
    pathToTarget: pathToTarget,
  };
};

const buildPathToTarget = (dfsGrid: DFSGrid, targetCoord: Coord): Coord[] => {
  const path: Coord[] = [];

  let currNode = dfsGrid[targetCoord.y][targetCoord.x];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    path.push(currNode);
    const prev = currNode.prevCoord;
    if (prev) {
      currNode = dfsGrid[prev.y][prev.x];
    } else {
      break;
    }
  }

  path.reverse();

  return path;
};

const findUnvisitedNeighbours = (grid: DFSGrid, coord: Coord): Coord[] => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const unvisitedNeighbours: Coord[] = [];

  if (coord.x > 0) {
    const n = grid[coord.y][coord.x - 1];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  if (coord.y > 0) {
    const n = grid[coord.y - 1][coord.x];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  if (coord.x < numCols - 1) {
    const n = grid[coord.y][coord.x + 1];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  if (coord.y < numRows - 1) {
    const n = grid[coord.y + 1][coord.x];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  return unvisitedNeighbours;
};
