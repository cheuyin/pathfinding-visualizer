import { Coord, Grid, MazeGenerationAlgorithm, Node } from '../../types/types';
import { assert, shuffle } from '../utils';

interface RBNode extends Node {
  visited: boolean;
}

type RBGrid = RBNode[][];

export const recursiveBacktracking: MazeGenerationAlgorithm = (
  grid: Grid,
  startCoord: Coord,
  targetCoord: Coord,
) => {
  const rbGrid = grid.map((row) =>
    row.map((node) => {
      return { ...node, visited: false };
    }),
  );

  const walls: Coord[] = [];

  const stack: Coord[] = [];
  stack.push(startCoord);
  rbGrid[startCoord.y][startCoord.x].visited = true;

  while (stack.length) {
    const currCoord = stack[stack.length - 1];
    const nextCoord = findNextMove(rbGrid, currCoord);

    if (nextCoord) {
      rbGrid[nextCoord.nextNodeToVisit.y][nextCoord.nextNodeToVisit.x].visited = true;
      rbGrid[nextCoord.pathNode.y][nextCoord.pathNode.x].visited = true;
      stack.push(nextCoord.nextNodeToVisit);
    } else {
      stack.pop();
    }
  }

  rbGrid.forEach((row) =>
    row.forEach((node) => {
      if (!node.visited) {
        if (node.x !== targetCoord.x || node.y !== targetCoord.y) {
          walls.push({
            x: node.x,
            y: node.y,
          });
        }
      }
    }),
  );

  return walls;
};

type FindNextMoveResult = { nextNodeToVisit: Coord; pathNode: Coord } | false;

const findNextMove = (grid: RBGrid, coord: Coord): FindNextMoveResult => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const directions = [1, 2, 3, 4];
  shuffle(directions);
  assert(directions.length === 4);

  let res: FindNextMoveResult = false;

  for (const d of directions) {
    let tempRes: FindNextMoveResult = false;

    switch (d) {
      case 1:
        tempRes = {
          nextNodeToVisit: {
            x: coord.x,
            y: coord.y - 2,
          },
          pathNode: {
            x: coord.x,
            y: coord.y - 1,
          },
        };
        break;
      case 2:
        tempRes = {
          nextNodeToVisit: {
            x: coord.x + 2,
            y: coord.y,
          },
          pathNode: {
            x: coord.x + 1,
            y: coord.y,
          },
        };
        break;
      case 3:
        tempRes = {
          nextNodeToVisit: {
            x: coord.x,
            y: coord.y + 2,
          },
          pathNode: {
            x: coord.x,
            y: coord.y + 1,
          },
        };
        break;
      case 4:
        tempRes = {
          nextNodeToVisit: {
            x: coord.x - 2,
            y: coord.y,
          },
          pathNode: {
            x: coord.x - 1,
            y: coord.y,
          },
        };
        break;
    }

    if (
      tempRes &&
      tempRes.nextNodeToVisit.x >= 0 &&
      tempRes.nextNodeToVisit.x < numCols &&
      tempRes.nextNodeToVisit.y >= 0 &&
      tempRes.nextNodeToVisit.y < numRows &&
      !grid[tempRes.nextNodeToVisit.y][tempRes.nextNodeToVisit.x].visited
    ) {
      res = tempRes;
      break;
    }
  }

  return res;
};
