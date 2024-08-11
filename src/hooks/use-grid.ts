import { useState } from 'react';
import { Grid as GridType } from '../types/types';
import { NodeState } from '../types/enums';
import { Node } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

const NUM_GRID_COLS = 50;
const NUM_GRID_ROWS = 25;

const SOURCE_COORD = {
  x: 5,
  y: 5,
};

const TARGET_COORD = {
  x: 40,
  y: 20,
};

export const useGrid = () => {
  const [grid, setGrid] = useState<GridType>(createInitialGrid(NUM_GRID_ROWS, NUM_GRID_COLS));

  return { grid, setGrid };
};

const createInitialGrid = (numRows: number, numCols: number): Node[][] => {
  const grid = [];
  for (let i = 0; i < numCols; i++) {
    const row = [];
    for (let j = 0; j < numRows; j++) {
      const node: Node = {
        id: uuidv4(),
        x: i,
        y: j,
        prevNode: null,
        type: NodeState.NORMAL,
        distance: Number.POSITIVE_INFINITY,
        visited: false,
      };

      if (i == SOURCE_COORD.x && j == SOURCE_COORD.y) {
        node.type = NodeState.SOURCE;
        node.distance = 0;
      } else if (i == TARGET_COORD.x && j == TARGET_COORD.y) {
        node.type = NodeState.TARGET;
      }

      row.push(node);
    }
    grid.push(row);
  }
  return grid;
};
