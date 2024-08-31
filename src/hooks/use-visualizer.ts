import { useState } from 'react';
import { Coord, Grid as GridType } from '../types/types';
import { NodeType } from '../types/enums';
import { Node } from '../types/types';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';
import { Algorithm } from '../types/types';
import { recursiveBacktracking } from '../utils/maze-generation-algorithms/recursive-backtracking';

const NUM_GRID_COLS = 60;
const NUM_GRID_ROWS = 25;

const SOURCE_COORD: Coord = {
  x: 10,
  y: 10,
};

const TARGET_COORD: Coord = {
  x: 55,
  y: 22,
};

export const useVisualizer = () => {
  const [grid, setGrid] = useState<GridType>(
    createEmptyGrid(NUM_GRID_COLS, NUM_GRID_ROWS, SOURCE_COORD, TARGET_COORD),
  );
  const [algorithm, setAlgorithm] = useState<Algorithm>(() => dijkstra);
  const [isVisualizing, setIsVisualizing] = useState(false);

  const setWall = (node: Node) => {
    if (isVisualizing) return false;

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
    setIsVisualizing(true);

    const algoResult = algorithm(grid, SOURCE_COORD, TARGET_COORD);

    const gridCopy: GridType = grid.map((row) =>
      row.map((node) => {
        return { ...node };
      }),
    );

    algoResult.visitedNodes.forEach((visitedCoord) => {
      const node = gridCopy[visitedCoord.y][visitedCoord.x];
      if (node.type === NodeType.SOURCE || node.type === NodeType.TARGET) return;
      gridCopy[visitedCoord.y][visitedCoord.x].type = NodeType.VISITED;
    });

    for (let i = 0; i <= algoResult.visitedNodes.length; i++) {
      if (i === algoResult.visitedNodes.length) {
        setTimeout(() => {
          if (algoResult.pathToTarget.length > 0) {
            algoResult.pathToTarget.forEach((pathToTarget) => {
              const node = gridCopy[pathToTarget.y][pathToTarget.x];
              if (node.type === NodeType.SOURCE || node.type === NodeType.TARGET) return;
              node.type = NodeType.PATH;
            });
            for (let j = 0; j < algoResult.pathToTarget.length; j++) {
              setTimeout(() => {
                const coord = algoResult.pathToTarget[j];
                const node = gridCopy[coord.y][coord.x];
                updateNode(node);

                if (j == algoResult.pathToTarget.length - 1) {
                  setIsVisualizing(false);
                }
              }, 10 * j);
            }
          } else {
            setIsVisualizing(false);
          }
        }, 5 * i);
      } else {
        setTimeout(() => {
          const coord = algoResult.visitedNodes[i];
          const node = gridCopy[coord.y][coord.x];
          updateNode(node);
        }, 5 * i);
      }
    }
  };

  const resetGrid = () => {
    const newGrid = createEmptyGrid(NUM_GRID_COLS, NUM_GRID_ROWS, SOURCE_COORD, TARGET_COORD);
    setGrid(newGrid);
  };

  const resetVisualization = () => {
    const newGrid: GridType = grid.map((row) =>
      row.map((node) => {
        if (node.type === NodeType.VISITED || node.type === NodeType.PATH) {
          return { ...node, type: NodeType.BLANK };
        } else {
          return { ...node };
        }
      }),
    );

    setGrid(newGrid);
  };

  const generateMaze = () => {
    setIsVisualizing(true);

    const blankGrid = createEmptyGrid(NUM_GRID_COLS, NUM_GRID_ROWS, SOURCE_COORD, TARGET_COORD);

    const walls = recursiveBacktracking(blankGrid, SOURCE_COORD, TARGET_COORD);
    for (let i = 0; i < walls.length; i++) {
      setTimeout(() => {
        const node = blankGrid[walls[i].y][walls[i].x];
        setWall(node);

        if (i == walls.length - 1) {
          setIsVisualizing(false);
        }
      }, 1 * i);
    }

    setGrid(blankGrid);
  };

  return {
    grid,
    setWall,
    animate,
    resetGrid,
    resetVisualization,
    setAlgorithm,
    isVisualizing,
    generateMaze,
  };
};

const createEmptyGrid = (
  numCols: number,
  numRows: number,
  sourceCoord: Coord,
  targetCoord: Coord,
): GridType => {
  const grid = [];
  for (let i = 0; i < numRows; i++) {
    const col = [];
    for (let j = 0; j < numCols; j++) {
      const node: Node = {
        x: j,
        y: i,
        type: NodeType.BLANK,
      };

      if (j == sourceCoord.x && i == sourceCoord.y) {
        node.type = NodeType.SOURCE;
      } else if (j == targetCoord.x && i == targetCoord.y) {
        node.type = NodeType.TARGET;
      }

      col.push(node);
    }
    grid.push(col);
  }
  return grid;
};
