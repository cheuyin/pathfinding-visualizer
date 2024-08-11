import { useEffect, useState } from 'react';
import { Grid as GridType } from '../types/types';
import { NodeType } from '../types/enums';
import { Node } from '../types/types';
import { v4 as uuidv4 } from 'uuid';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';
import { assert } from '../utils/utils';

const NUM_GRID_COLS = 50;
const NUM_GRID_ROWS = 25;

const SOURCE_COORD = {
  x: 5,
  y: 10,
};

const TARGET_COORD = {
  x: 40,
  y: 20,
};

export const useGrid = () => {
  const [grid, setGrid] = useState<GridType>(createInitialGrid(NUM_GRID_ROWS, NUM_GRID_COLS));
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      const newGrid = dijkstra(grid);
      if (!newGrid) {
        setIsRunning(false);
        clearInterval(intervalId);
      } else if (isTargetVisited(newGrid)) {
        setIsRunning(false);
        clearInterval(intervalId);
        const finalGrid = markOptimalPath(newGrid);
        setGrid(finalGrid);
      } else {
        setGrid(newGrid);
      }
    }, 5);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

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

const isTargetVisited = (grid: GridType): boolean => {
  for (const row of grid) {
    for (const node of row) {
      if (node.type === NodeType.TARGET && node.visited) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Produces a shallow copy of a grid where a path from the source node to target node is marked
 *
 * Assumptions:
 * - There exists a path from the source to the target (i.e. target node isn't blocked off by walls)
 */
const markOptimalPath = (grid: GridType): GridType => {
  const newGrid = [...grid];

  let target: Node | null = null;

  for (const row of newGrid) {
    for (const node of row) {
      if (node.type === NodeType.TARGET) {
        target = node;
      }
    }
  }

  assert(target !== null, 'Hello');

  let currNode: Node | null = (target as Node).prevNode;
  while (currNode && currNode.prevNode) {
    currNode.type = NodeType.PATH;
    currNode = currNode.prevNode;
  }

  return newGrid;
};
