import { NodeType } from '../../types/enums';
import { Coord, Grid } from '../../types/types';
import { Node } from '../../types/types';

interface DijkstraNode extends Node {
  distance: number;
  visited: boolean;
  prevCoord: Coord | null;
}

type DijkstraGrid = DijkstraNode[][];

export const dijkstra = (grid: Grid, sourceCoord: Coord, targetCoord: Coord) => {
  const dijkstraGrid: DijkstraNode[][] = grid.map((row) =>
    row.map((node) => {
      return {
        ...node,
        distance: Number.POSITIVE_INFINITY,
        visited: false,
        prevCoord: null,
      };
    }),
  );

  dijkstraGrid[sourceCoord.y][sourceCoord.x].distance = 0;

  const visited: Coord[] = [];
  let pathToTarget: Coord[] = [];

  let currCoord = findUnvisitedNodeWithShortestDistance(dijkstraGrid);

  while (currCoord) {
    if (dijkstraGrid[currCoord.y][currCoord.x].type === NodeType.TARGET) {
      visited.push(currCoord);
      pathToTarget = buildPathToTarget(dijkstraGrid, targetCoord);
      break;
    }

    const unvisitedNeighbours: Coord[] = findUnvisitedNeighbours(dijkstraGrid, currCoord);

    for (const c of unvisitedNeighbours) {
      const currDist = dijkstraGrid[currCoord.y][currCoord.x].distance + 1;
      if (currDist < dijkstraGrid[c.y][c.x].distance) {
        dijkstraGrid[c.y][c.x].distance = currDist;
        dijkstraGrid[c.y][c.x].prevCoord = currCoord;
      }
    }

    dijkstraGrid[currCoord.y][currCoord.x].visited = true;
    visited.push(currCoord);

    currCoord = findUnvisitedNodeWithShortestDistance(dijkstraGrid);
  }

  return {
    visitedNodes: visited,
    pathToTarget: pathToTarget,
  };
};

const buildPathToTarget = (dijkstraGrid: DijkstraGrid, targetCoord: Coord): Coord[] => {
  const path: Coord[] = [];

  let currNode = dijkstraGrid[targetCoord.y][targetCoord.x];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    path.push(currNode);
    const prev = currNode.prevCoord;
    if (prev) {
      currNode = dijkstraGrid[prev.y][prev.x];
    } else {
      break;
    }
  }

  path.reverse();

  return path;
};

const findUnvisitedNodeWithShortestDistance = (grid: DijkstraGrid): Coord | false => {
  let res: Coord | false = false;

  for (const row of grid) {
    for (const node of row) {
      if (
        node.visited ||
        node.distance === Number.POSITIVE_INFINITY ||
        node.type === NodeType.WALL
      ) {
        continue;
      }
      if (!res || node.distance < grid[res.y][res.x].distance) {
        res = node;
      }
    }
  }

  return res;
};

const findUnvisitedNeighbours = (grid: DijkstraGrid, coord: Coord): Coord[] => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const unvisitedNeighbours: Coord[] = [];

  if (coord.x > 0) {
    const n = grid[coord.y][coord.x - 1];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  if (coord.x < numCols - 1) {
    const n = grid[coord.y][coord.x + 1];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  if (coord.y > 0) {
    const n = grid[coord.y - 1][coord.x];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  if (coord.y < numRows - 1) {
    const n = grid[coord.y + 1][coord.x];
    if (!n.visited && n.type !== NodeType.WALL) unvisitedNeighbours.push(n);
  }

  return unvisitedNeighbours;
};
