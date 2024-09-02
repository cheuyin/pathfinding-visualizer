import { useEffect, useState } from 'react';
import { Coord, Grid as GridType } from '../types/types';
import { NodeType } from '../types/enums';
import { Node } from '../types/types';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';
import { Algorithm } from '../types/types';
import { recursiveBacktracking } from '../utils/maze-generation-algorithms/recursive-backtracking';

export const useVisualizer = () => {
  const [numGridCols, setNumGridCols] = useState<number | null>(null);
  const [numGridRows, setNumGridRows] = useState<number | null>(null);
  const [sourceCoord, setSourceCoord] = useState<Coord | null>(null);
  const [targetCoord, setTargetCoord] = useState<Coord | null>(null);
  const [grid, setGrid] = useState<GridType>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm>(() => dijkstra);
  const [isVisualizing, setIsVisualizing] = useState(false);

  useEffect(() => {
    if (!numGridCols || !numGridRows) return;
    const randomSourceCoord = generateRandomCoord(numGridCols, numGridRows);
    const randomTargetCoord = generateRandomCoord(numGridCols, numGridRows);
    setTargetCoord(randomTargetCoord);
    setSourceCoord(randomSourceCoord);
    setGrid(createEmptyGrid(numGridCols, numGridRows, randomSourceCoord, randomTargetCoord));
  }, [numGridCols, numGridRows]);

  const setTargetNode = (coord: Coord) => {
    setGrid((prevGrid) => {
      if (prevGrid[coord.y][coord.x].type === NodeType.SOURCE) {
        return prevGrid;
      }
      setTargetCoord(coord);
      const gridCopy = prevGrid.map((row) =>
        row.map((node) => {
          const nodeCopy = { ...node };
          if (node.type === NodeType.TARGET) {
            node.type = NodeType.BLANK;
          }
          if (node.x === coord.x && node.y === coord.y) {
            node.type = NodeType.TARGET;
          }
          return nodeCopy;
        }),
      );

      return gridCopy;
    });
  };

  const setSourceNode = (coord: Coord) => {
    setGrid((prevGrid) => {
      if (prevGrid[coord.y][coord.x].type === NodeType.TARGET) {
        return prevGrid;
      }
      setSourceCoord(coord);
      const gridCopy = prevGrid.map((row) =>
        row.map((node) => {
          const nodeCopy = { ...node };
          if (node.type === NodeType.SOURCE) {
            node.type = NodeType.BLANK;
          }
          if (node.x === coord.x && node.y === coord.y) {
            node.type = NodeType.SOURCE;
          }
          return nodeCopy;
        }),
      );

      return gridCopy;
    });
  };

  const generateRandomCoord = (numCols: number, numRows: number): Coord => {
    return {
      x: Math.floor(Math.random() * numCols),
      y: Math.floor(Math.random() * numRows),
    };
  };

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

  const createShallowGridCopyWithUpdatedNode = (grid: GridType, node: Node) => {
    const gridCopy = grid.map((row) => [...row]);
    gridCopy[node.y][node.x] = node;
    return gridCopy;
  };

  const animate = () => {
    if (!numGridCols || !numGridRows || !sourceCoord || !targetCoord) return;

    setIsVisualizing(true);

    const gridCopy: GridType = createGridCopyWithNoPath(grid);

    const algoResult = algorithm(gridCopy, sourceCoord, targetCoord);

    for (let i = 0; i <= algoResult.visitedNodes.length; i++) {
      if (i === algoResult.visitedNodes.length) {
        setTimeout(() => {
          if (algoResult.pathToTarget.length > 0) {
            for (let j = 0; j < algoResult.pathToTarget.length; j++) {
              setTimeout(() => {
                if (j == algoResult.pathToTarget.length - 1) {
                  setIsVisualizing(false);
                }

                const coord = algoResult.pathToTarget[j];
                const node = gridCopy[coord.y][coord.x];
                if (node.type === NodeType.SOURCE || node.type === NodeType.TARGET) return;
                node.type = NodeType.PATH;
                setGrid(createShallowGridCopyWithUpdatedNode(gridCopy, node));
              }, 20 * j);
            }
          } else {
            setIsVisualizing(false);
          }
        }, 1 * i);
      } else {
        setTimeout(() => {
          const coord = algoResult.visitedNodes[i];
          const node = gridCopy[coord.y][coord.x];
          if (node.type === NodeType.SOURCE || node.type === NodeType.TARGET) return;
          node.type = NodeType.VISITED;
          setGrid(createShallowGridCopyWithUpdatedNode(gridCopy, node));
        }, 1 * i);
      }
    }
  };

  const resetGrid = () => {
    if (!numGridCols || !numGridRows || !sourceCoord || !targetCoord) return;
    setGrid(createEmptyGrid(numGridCols, numGridRows, sourceCoord, targetCoord));
  };

  const resetVisualization = () => {
    setGrid(createGridCopyWithNoPath(grid));
  };

  const generateMaze = () => {
    if (!numGridCols || !numGridRows || !sourceCoord || !targetCoord) return;

    setIsVisualizing(true);

    const blankGrid = createEmptyGrid(numGridCols, numGridRows, sourceCoord, targetCoord);

    const walls = recursiveBacktracking(blankGrid, sourceCoord, targetCoord);
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
    setTargetNode,
    setSourceNode,
    setNumGridCols,
    setNumGridRows,
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

const createGridCopyWithNoPath = (grid: GridType) => {
  return grid.map((row) =>
    row.map((node) => {
      if (node.type === NodeType.VISITED || node.type === NodeType.PATH) {
        return {
          ...node,
          type: NodeType.BLANK,
        };
      } else {
        return {
          ...node,
        };
      }
    }),
  );
};
