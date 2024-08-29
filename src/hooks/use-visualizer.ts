import { useState } from 'react';
import { Coord, Grid as GridType } from '../types/types';
import { NodeType } from '../types/enums';
import { Node } from '../types/types';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';
import { Algorithm } from '../types/types';

const NUM_GRID_COLS = 70;
const NUM_GRID_ROWS = 30;

const SOURCE_COORD: Coord = {
  x: 10,
  y: 10,
};

const TARGET_COORD: Coord = {
  x: 55,
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
  const animate = () => {
    const algoResult = algorithm(grid, SOURCE_COORD, TARGET_COORD);

    algoResult.visitedNodes.pop();
    algoResult.visitedNodes.shift();
    algoResult.pathToTarget.pop();
    algoResult.pathToTarget.shift();

    for (let i = 0; i <= algoResult.visitedNodes.length; i++) {
      if (i == algoResult.visitedNodes.length) {
        setTimeout(() => {
          animatePath(algoResult.pathToTarget);
        }, 5 * i);
        return;
      }
      setTimeout(() => {
        const coord = algoResult.visitedNodes[i];
        const gridCell = document.getElementById(`GridCell-${coord.x}-${coord.y}`);
        gridCell?.classList.add('GridCell--visited');
      }, 5 * i);
    }
  };

  const animatePath = (path: Coord[]) => {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const coord = path[i];
        const gridCell = document.getElementById(`GridCell-${coord.x}-${coord.y}`);
        gridCell?.classList.add('GridCell--path');
      }, 25 * i);
    }
  };

  const resetGrid = () => {
    setGrid(createInitialGrid(NUM_GRID_ROWS, NUM_GRID_COLS));
  };

  return { grid, setWall, animate, resetGrid, setAlgorithm };
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
