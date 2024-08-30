import { useRef, useState } from 'react';
import { Coord, Grid as GridType } from '../types/types';
import { NodeType } from '../types/enums';
import { Node } from '../types/types';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';
import { Algorithm } from '../types/types';

const NUM_GRID_COLS = 200;
const NUM_GRID_ROWS = 50;

const SOURCE_COORD: Coord = {
  x: 10,
  y: 10,
};

const TARGET_COORD: Coord = {
  x: 155,
  y: 45,
};

export const useVisualizer = () => {
  const [grid, setGrid] = useState<GridType>(createInitialGrid(NUM_GRID_ROWS, NUM_GRID_COLS));
  const [algorithm, setAlgorithm] = useState<Algorithm>(() => dijkstra);
  const timoutIdsRef = useRef([] as number[]);

  const setWall = (node: Node) => {
    const nodeCopy = { ...node };

    if (nodeCopy.type === NodeType.BLANK) {
      nodeCopy.type = NodeType.WALL;
    }

    setGrid((prevGrid) => {
      return prevGrid.map((prevRow) =>
        prevRow.map((prevNode) => {
          if (prevNode.x === nodeCopy.x && prevNode.y === nodeCopy.y) {
            return nodeCopy;
          } else {
            return prevNode;
          }
        }),
      );
    });
  };

  const updateNode = (node: Node) => {
    const nodeCopy = { ...node };
    const gridCopy = grid.map((row) => row);
    gridCopy[node.y][node.x] = nodeCopy;
    setGrid(gridCopy);
  };

  const animate = () => {
    const algoResult = algorithm(grid, SOURCE_COORD, TARGET_COORD);

    const gridCopy: GridType = grid.map((row) =>
      row.map((node) => {
        return { ...node };
      }),
    );

    algoResult.visitedNodes.forEach((visitedCoord) => {
      gridCopy[visitedCoord.y][visitedCoord.x].type = NodeType.VISITED;
    });

    for (let i = 0; i <= algoResult.visitedNodes.length; i++) {
      if (i === algoResult.visitedNodes.length) {
        const animation1 = setTimeout(() => {
          algoResult.pathToTarget.forEach((pathToTarget) => {
            gridCopy[pathToTarget.y][pathToTarget.x].type = NodeType.PATH;
          });
          for (let j = 0; j < algoResult.pathToTarget.length; j++) {
            const animation2 = setTimeout(() => {
              const coord = algoResult.pathToTarget[j];
              const node = gridCopy[coord.y][coord.x];
              updateNode(node);
            }, 25 * j);
            timoutIdsRef.current.push(animation2);
          }
        }, 1 * i);
        timoutIdsRef.current.push(animation1);
        return;
      }
      const animation3 = setTimeout(() => {
        const coord = algoResult.visitedNodes[i];
        const node = gridCopy[coord.y][coord.x];
        updateNode(node);
      }, 1 * i);
      timoutIdsRef.current.push(animation3);
    }

    setGrid(gridCopy);
  };

  const resetGrid = () => {
    timoutIdsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    timoutIdsRef.current = [];
    const newGrid = createInitialGrid(NUM_GRID_ROWS, NUM_GRID_COLS);
    setGrid(newGrid);
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
