import { NodeType } from '../../types/enums';
import { Algorithm, Coord, Grid } from '../../types/types';
import { Node } from '../../types/types';

interface AStarNode extends Node {
  visited: boolean;
  prevCoord: Coord | null;
  g: number;
  h: number;
  f: number;
}

type AStarGrid = AStarNode[][];

export const aStar: Algorithm = (grid: Grid, sourceCoord: Coord, targetCoord: Coord) => {
  const aStarGrid: AStarNode[][] = grid.map((row) =>
    row.map((node) => {
      return {
        ...node,
        g: Number.POSITIVE_INFINITY,
        h: Number.POSITIVE_INFINITY,
        f: Number.POSITIVE_INFINITY,
        visited: false,
        prevCoord: null,
      };
    }),
  );

  aStarGrid.forEach((row) =>
    row.forEach((node) => {
      node.h = calculateHScore(node, targetCoord);
    }),
  );

  const startNode = aStarGrid[sourceCoord.y][sourceCoord.x];
  startNode.g = 0;
  startNode.f = startNode.h;

  const visited: Coord[] = [];
  let pathToTarget: Coord[] = [];

  let currCoord = findUnvisitedNodeWithLowestFScore(aStarGrid);

  while (currCoord) {
    if (aStarGrid[currCoord.y][currCoord.x].type === NodeType.TARGET) {
      visited.push(currCoord);
      pathToTarget = buildPathToTarget(aStarGrid, targetCoord);
      break;
    }

    const unvisitedNeighbours: Coord[] = findUnvisitedNeighbours(aStarGrid, currCoord);

    for (const c of unvisitedNeighbours) {
      const currDist = aStarGrid[currCoord.y][currCoord.x].g + 1;
      const neighbour = aStarGrid[c.y][c.x];
      if (currDist < neighbour.g) {
        neighbour.g = currDist;
        neighbour.f = neighbour.g + neighbour.h;
        neighbour.prevCoord = currCoord;
      }
    }

    aStarGrid[currCoord.y][currCoord.x].visited = true;
    visited.push(currCoord);

    currCoord = findUnvisitedNodeWithLowestFScore(aStarGrid);
  }

  return {
    visitedNodes: visited,
    pathToTarget: pathToTarget,
  };
};

const calculateHScore = (node: Node, targetCoord: Coord) => {
  return Math.abs(node.x - targetCoord.x) + Math.abs(node.y - targetCoord.y);
};

const buildPathToTarget = (aStarGrid: AStarGrid, targetCoord: Coord): Coord[] => {
  const path: Coord[] = [];

  let currNode = aStarGrid[targetCoord.y][targetCoord.x];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    path.push(currNode);
    const prev = currNode.prevCoord;
    if (prev) {
      currNode = aStarGrid[prev.y][prev.x];
    } else {
      break;
    }
  }

  path.reverse();

  return path;
};

const findUnvisitedNodeWithLowestFScore = (grid: AStarGrid): Coord | false => {
  let res: Coord | false = false;

  for (const row of grid) {
    for (const node of row) {
      if (node.visited || node.f === Number.POSITIVE_INFINITY || node.type === NodeType.WALL) {
        continue;
      }
      if (!res || node.f < grid[res.y][res.x].f) {
        res = node;
      }
    }
  }

  return res;
};

const findUnvisitedNeighbours = (grid: AStarGrid, coord: Coord): Coord[] => {
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
