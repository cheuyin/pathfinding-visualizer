import { NUM_GRID_COLS, NUM_GRID_ROWS } from '../config/constants';
import { Coordinate } from '../types/types';
import { Grid } from './grid';

const startNode: Coordinate = {
  rowId: 2,
  colId: 4,
};

const targetNode: Coordinate = {
  rowId: 23,
  colId: 40,
};

export const GridController = () => {
  return (
    <Grid
      numCols={NUM_GRID_COLS}
      numRows={NUM_GRID_ROWS}
      startNode={startNode}
      targetNode={targetNode}
    />
  );
};
