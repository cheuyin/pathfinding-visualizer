import { useState } from 'react';
import { Coord, Grid as GridType } from '../types/types';
import { NodeType } from '../types/enums';
import { Node } from '../types/types';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';
import { Algorithm } from '../types/types';

const NUM_GRID_COLS = 50;
const NUM_GRID_ROWS = 30;

const SOURCE_COORD: Coord = {
  x: 10,
  y: 10,
};

const TARGET_COORD: Coord = {
  x: 35,
  y: 25,
};

export const useVisualizer = () => {
  const [grid, setGrid] = useState<GridType>(createInitialGrid(NUM_GRID_ROWS, NUM_GRID_COLS));
  const [algorithm, setAlgorithm] = useState<Algorithm>(() => dijkstra);

  const setWall = (node: Node) => {
    const nodeCopy = { ...node };

    if (nodeCopy.type === NodeType.BLANK) {
      nodeCopy.type = NodeType.WALL;
    }

    setGrid((prevGrid) => {
      return prevGrid.map((prevRow) =>
        prevRow.map((prevNode) =>
          prevNode.x === nodeCopy.x && prevNode.y === nodeCopy.y ? nodeCopy : prevNode,
        ),
      );
    });
  };

  /**
   * Visualizes the selected algorithm by rapidly changing the state of individual nodes.
   */
  const visualize = () => {
    const pathToVisit = algorithm(grid, SOURCE_COORD, TARGET_COORD);

    pathToVisit.forEach((coord) => {
      setTimeout(() => {
        setGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          const nodeToUpdate = newGrid[coord.y][coord.x];
          nodeToUpdate.type = NodeType.PATH;
          return newGrid;
        });
      }, 1);
    });
  };

  const resetGrid = () => {
    setGrid(createInitialGrid(NUM_GRID_ROWS, NUM_GRID_COLS));
  };

  return { grid, setWall, visualize, resetGrid, setAlgorithm };
};

const createInitialGrid = (numRows: number, numCols: number): GridType => {
  const grid = [];
  for (let i = 0; i < numRows; i++) {
    const col = [];
    for (let j = 0; j < numCols; j++) {
      const node: Node = {
        x: j,
        y: i,
        type: NodeType.BLANK,
      };

      if (j == SOURCE_COORD.x && i == SOURCE_COORD.y) {
        node.type = NodeType.SOURCE;
      } else if (j == TARGET_COORD.x && i == TARGET_COORD.y) {
        node.type = NodeType.TARGET;
      }

      col.push(node);
    }
    grid.push(col);
  }
  return grid;
};
