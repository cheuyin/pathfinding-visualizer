import { useEffect, useReducer, useState } from 'react';
import { Coord, Grid as GridType } from '../types/types';
import { dijkstra } from '@/algorithms/pathfinding/dijkstra';
import { Algorithm } from '../types/types';
import { recursiveBacktracking } from '@/algorithms/maze/recursive-backtracking';
import { createEmptyGrid, createGridCopyWithNoPath } from '@/grid/state/grid-utils';
import { gridReducer } from '@/grid/state/grid-reducer';
import { VISITED_NODE_DELAY_MS, PATH_NODE_DELAY_MS, MAZE_WALL_DELAY_MS } from '../constants';
import { useCallback } from 'react';

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
  const setWall = useCallback(
    (coord: Coord) => {
      if (isVisualizing) return;
      dispatchGrid({ type: 'SET_WALL', coord });
    },
    [isVisualizing],
  );

  const updateSource = useCallback((coord: Coord) => {
    setSourceCoord(coord);
    dispatchGrid({ type: 'SET_SOURCE', coord });
  }, []);

  const updateTarget = useCallback((coord: Coord) => {
    setTargetCoord(coord);
    dispatchGrid({ type: 'SET_TARGET', coord });
  }, []);

  // ------ Algorithm Animation --------------------------------------------
  const animate = useCallback(() => {
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
      coords.forEach((c: Coord, idx: number) => {
        setTimeout(() => {
          dispatchGrid({ type: action, coord: c });
          if (idx === coords.length - 1) onFinish();
        }, delay * idx);
      });
    };

    markWithDelay(visitedNodes, 'MARK_VISITED', VISITED_NODE_DELAY_MS, () => {
      if (pathToTarget.length === 0) {
        setIsVisualizing(false);
        return;
      }
      markWithDelay(pathToTarget, 'MARK_PATH', PATH_NODE_DELAY_MS, () => setIsVisualizing(false));
    });
  }, [sourceCoord, targetCoord, grid, algorithm]);

  const resetGrid = useCallback(() => {
    if (!numGridCols || !numGridRows || !sourceCoord || !targetCoord) return;
    dispatchGrid({
      type: 'RESET',
      grid: createEmptyGrid(numGridCols, numGridRows, sourceCoord, targetCoord),
    });
  }, [numGridCols, numGridRows, sourceCoord, targetCoord]);

  const resetVisualization = useCallback(() => dispatchGrid({ type: 'CLEAR_VISUALIZATION' }), []);

  const generateMaze = useCallback(() => {
    if (!numGridCols || !numGridRows || !sourceCoord || !targetCoord) return;
    setIsVisualizing(true);

    const freshGrid = createEmptyGrid(numGridCols, numGridRows, sourceCoord, targetCoord);
    dispatchGrid({ type: 'RESET', grid: freshGrid });

    const walls = recursiveBacktracking(freshGrid, sourceCoord, targetCoord);
    walls.forEach((c, idx) => {
      setTimeout(() => {
        dispatchGrid({ type: 'SET_WALL', coord: c });
        if (idx === walls.length - 1) setIsVisualizing(false);
      }, MAZE_WALL_DELAY_MS * idx);
    });
  }, [numGridCols, numGridRows, sourceCoord, targetCoord]);

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
    updateSource,
    updateTarget,
    setNumGridCols,
    setNumGridRows,
  };
};

const generateRandomCoord = (numCols: number, numRows: number): Coord => ({
  x: Math.floor(Math.random() * numCols),
  y: Math.floor(Math.random() * numRows),
});
