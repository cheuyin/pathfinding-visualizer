import { NUM_GRID_COLS, NUM_GRID_ROWS } from '../config/constants';
import { Grid } from '../components/grid';
import { useState } from 'react';
import { Node } from '../types/types';
import { NodeState } from '../types/enums';

const SOURCE_COORD = {
  x: 5,
  y: 5,
};

const TARGET_COORD = {
  x: 25,
  y: 10,
};

export const VisualizationController = () => {
  const [grid, setGrid] = useState<Node[][]>(createInitialGrid(NUM_GRID_ROWS, NUM_GRID_COLS));

  return <Grid grid={grid} />;
};

const createInitialGrid = (numRows: number, numCols: number): Node[][] => {
  const grid = [];
  for (let i = 0; i < numRows; i++) {
    const row = [];
    for (let j = 0; j < numCols; j++) {
      const node: Node = {
        prevCell: null,
        type: NodeState.NORMAL,
        weight: Number.POSITIVE_INFINITY,
      };

      if (i + 1 == SOURCE_COORD.y && j + 1 == SOURCE_COORD.x) {
        node.type = NodeState.SOURCE;
      } else if (i + 1 == TARGET_COORD.y && j + 1 == TARGET_COORD.x) {
        node.type = NodeState.TARGET;
      }

      row.push(node);
    }
    grid.push(row);
  }
  return grid;
};
