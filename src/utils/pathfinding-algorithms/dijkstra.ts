import { NodeType } from '../../types/enums';
import { Coord, Grid } from '../../types/types';
import { Node } from '../../types/types';

interface DijkstraNode extends Node {
  distance: number;
  visited: boolean;
  prevCoord: Coord | null;
}

type DijkstraGrid = DijkstraNode[][];

export const dijkstra = (grid: Grid, sourceCoord: Coord): Coord[] => {
  /**
   * 1. Convert nodes into Dijkstra nodes for the purpose of this algorithm.
   * 2. Starting at the source node, run the algorithm until completion.
   * 3. Return array of coords.
   */

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

  const nodesToVisit: Coord[] = [];

  let currCoord = findUnvisitedNodeWithShortestDistance(dijkstraGrid);

  while (currCoord) {
    if (dijkstraGrid[currCoord.y][currCoord.x].type === NodeType.TARGET) {
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
    nodesToVisit.push(currCoord);

    currCoord = findUnvisitedNodeWithShortestDistance(dijkstraGrid);
  }

  nodesToVisit.shift(); // Remove the source node from the path.
  return nodesToVisit;
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
