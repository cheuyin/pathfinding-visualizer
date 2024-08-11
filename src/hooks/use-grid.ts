import { useState } from 'react';
import { Grid as GridType } from '../types/types';
import { NodeType } from '../types/enums';
import { Node } from '../types/types';
import { v4 as uuidv4 } from 'uuid';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';

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

  setInterval(() => {
    const newGrid = dijkstra(grid);
    setGrid(newGrid);
  }, 1000);

  return { grid, setGrid };
};

const createInitialGrid = (numRows: number, numCols: number): GridType => {
  const grid = [];
  for (let i = 0; i < numRows; i++) {
    const col = [];
    for (let j = 0; j < numCols; j++) {
      const node: Node = {
        id: uuidv4(),
        x: j,
        y: i,
        prevNode: null,
        type: NodeType.BLANK,
        distance: Number.POSITIVE_INFINITY,
        visited: false,
      };

      if (j == SOURCE_COORD.x && i == SOURCE_COORD.y) {
        node.type = NodeType.SOURCE;
        node.distance = 0;
      } else if (j == TARGET_COORD.x && i == TARGET_COORD.y) {
        node.type = NodeType.TARGET;
      }

      col.push(node);
    }
    grid.push(col);
  }
  return grid;
};
