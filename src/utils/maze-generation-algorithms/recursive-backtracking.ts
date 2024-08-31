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
    const nextCoord = findNextCoord(rbGrid, currCoord);

    if (nextCoord) {
      rbGrid[nextCoord.y][nextCoord.x].visited = true;
      stack.push(nextCoord);
    } else {
      stack.pop();
    }
  }

  rbGrid.forEach((row) =>
    row.forEach((node) => {
      if (!node.visited) {
        if (node.x !== targetCoord.x && node.y !== targetCoord.y) {
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

const findNextCoord = (grid: RBGrid, coord: Coord): Coord | false => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const directions = [1, 2, 3, 4];
  shuffle(directions);
  assert(directions.length === 4);

  let nextCoord: Coord | false = false;

  for (const d of directions) {
    let tempCoord: Coord | false = false;

    switch (d) {
      case 1:
        tempCoord = {
          x: coord.x,
          y: coord.y - 2,
        };
        break;
      case 2:
        tempCoord = {
          x: coord.x + 2,
          y: coord.y,
        };
        break;
      case 3:
        tempCoord = {
          x: coord.x,
          y: coord.y + 2,
        };
        break;
      case 4:
        tempCoord = {
          x: coord.x - 2,
          y: coord.y,
        };
        break;
    }

    tempCoord = tempCoord as Coord;

    if (
      tempCoord.x >= 0 &&
      tempCoord.x < numCols &&
      tempCoord.y >= 0 &&
      tempCoord.y < numRows &&
      !grid[tempCoord.y][tempCoord.x].visited
    ) {
      nextCoord = tempCoord;
      break;
    }
  }

  return nextCoord;
};
