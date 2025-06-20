import { useEffect, useReducer, useState } from 'react';
import { Coord, Grid as GridType } from '../types/types';
import { NodeType } from '../types/enums';
import { Node } from '../types/types';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';
import { Algorithm } from '../types/types';
import { recursiveBacktracking } from '../utils/maze-generation-algorithms/recursive-backtracking';
import { createEmptyGrid, createGridCopyWithNoPath } from './grid-utils';
import { gridReducer } from './grid-reducer';

export const useVisualizer = () => {
  const [numGridCols, setNumGridCols] = useState<number | null>(null);
  const [numGridRows, setNumGridRows] = useState<number | null>(null);
  const [sourceCoord, setSourceCoord] = useState<Coord | null>(null);
  const [targetCoord, setTargetCoord] = useState<Coord | null>(null);
  const [algorithm, setAlgorithm] = useState<Algorithm>(() => dijkstra);
  const [isVisualizing, setIsVisualizing] = useState(false);

  // Grid managed by reducer
  const [grid, dispatchGrid] = useReducer(gridReducer, [] as GridType);

  // ------ Initialization --------------------------------------------------
  useEffect(() => {
    if (!numGridCols || !numGridRows) return;
    const randomSource = generateRandomCoord(numGridCols, numGridRows);
    const randomTarget = generateRandomCoord(numGridCols, numGridRows);
    setSourceCoord(randomSource);
    setTargetCoord(randomTarget);
    const freshGrid = createEmptyGrid(numGridCols, numGridRows, randomSource, randomTarget);
    dispatchGrid({ type: 'RESET', grid: freshGrid });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numGridCols, numGridRows]);

  // ------ User interactions ----------------------------------------------
  const setWall = (coord: Coord) => {
    if (isVisualizing) return;
    dispatchGrid({ type: 'SET_WALL', coord });
  };

  const updateSource = (coord: Coord) => {
    setSourceCoord(coord);
    dispatchGrid({ type: 'SET_SOURCE', coord });
  };

  const updateTarget = (coord: Coord) => {
    setTargetCoord(coord);
    dispatchGrid({ type: 'SET_TARGET', coord });
  };

  // ------ Algorithm Animation --------------------------------------------
  const animate = () => {
    if (!sourceCoord || !targetCoord) return;
    setIsVisualizing(true);

    const workingGrid: GridType = createGridCopyWithNoPath(grid);
    const { visitedNodes, pathToTarget } = algorithm(workingGrid, sourceCoord, targetCoord);

    // helper to mark nodes with a delay
    const markWithDelay = (
      coords: Coord[],
      action: 'MARK_VISITED' | 'MARK_PATH',
      delay: number,
      onFinish: () => void,
    ) => {
      coords.forEach((c, idx) => {
        setTimeout(() => {
          dispatchGrid({ type: action, coord: c });
          if (idx === coords.length - 1) onFinish();
        }, delay * idx);
      });
    };

    markWithDelay(visitedNodes, 'MARK_VISITED', 2, () => {
      if (pathToTarget.length === 0) {
        setIsVisualizing(false);
        return;
      }
      markWithDelay(pathToTarget, 'MARK_PATH', 20, () => setIsVisualizing(false));
    });
  };

  const resetGrid = () => {
    if (!numGridCols || !numGridRows || !sourceCoord || !targetCoord) return;
    dispatchGrid({
      type: 'RESET',
      grid: createEmptyGrid(numGridCols, numGridRows, sourceCoord, targetCoord),
    });
  };

  const resetVisualization = () => dispatchGrid({ type: 'CLEAR_VISUALIZATION' });

  const generateMaze = () => {
    if (!numGridCols || !numGridRows || !sourceCoord || !targetCoord) return;
    setIsVisualizing(true);

    const freshGrid = createEmptyGrid(numGridCols, numGridRows, sourceCoord, targetCoord);
    dispatchGrid({ type: 'RESET', grid: freshGrid });

    const walls = recursiveBacktracking(freshGrid, sourceCoord, targetCoord);
    walls.forEach((c, idx) => {
      setTimeout(() => {
        dispatchGrid({ type: 'SET_WALL', coord: c });
        if (idx === walls.length - 1) setIsVisualizing(false);
      }, idx); // 1 ms per wall for same speed as before
    });
  };

  // -----------------------------------------------------------------------
  return {
    grid,
    isVisualizing,
    animate,
    resetGrid,
    resetVisualization,
    setAlgorithm,
    generateMaze,
    // outward API setters
    setWall,
    setSourceNode: updateSource,
    setTargetNode: updateTarget,
    setNumGridCols,
    setNumGridRows,
  };
};

const generateRandomCoord = (numCols: number, numRows: number): Coord => ({
  x: Math.floor(Math.random() * numCols),
  y: Math.floor(Math.random() * numRows),
});
