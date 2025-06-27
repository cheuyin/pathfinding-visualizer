import '@mantine/core/styles.css';
import { CanvasGrid } from '@/grid/components/canvas-grid';
import { Header, Controls } from '@/ui';
import './app.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { PathfindingAlgorithmRegistry } from '@/algorithms/pathfinding';
import { useVisualizer } from './hooks/use-visualizer';
import { useEffect, useState, useRef } from 'react';
import { CELL_SIZE_PX } from './constants';

const theme = createTheme({});

type PathfindingAlgorithmName = keyof typeof PathfindingAlgorithmRegistry;

export const App = () => {
  const {
    grid,
    setWall,
    isVisualizing,
    animate,
    resetGrid,
    resetVisualization,
    setAlgorithm,
    generateMaze,
    updateSource,
    updateTarget,
    setNumGridCols,
    setNumGridRows,
  } = useVisualizer();

  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<PathfindingAlgorithmName>("Dijkstra's");

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Effect to handle window resize and calculate grid size
  useEffect(() => {
    const calculateGridSize = () => {
      if (canvasContainerRef.current) {
        const rect = canvasContainerRef.current.getBoundingClientRect();
        const numCols = Math.floor(rect.width / CELL_SIZE_PX);
        const numRows = Math.floor(rect.height / CELL_SIZE_PX);
        setNumGridCols(numCols);
        setNumGridRows(numRows);
      }
    };

    const resizeObserver = new ResizeObserver(calculateGridSize);
    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }

    calculateGridSize(); // Initial calculation

    return () => {
      resizeObserver.disconnect();
    };
  }, [setNumGridCols, setNumGridRows]);

  const onAlgorithmSelection = (algorithm: PathfindingAlgorithmName) => {
    setSelectedAlgorithm(algorithm);

    const algoFn = PathfindingAlgorithmRegistry[algorithm];
    if (algoFn) {
      setAlgorithm(() => algoFn);
    }
  };

  return (
    <MantineProvider theme={theme}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div ref={canvasContainerRef} style={{ flex: 1, overflow: 'hidden' }}>
          <CanvasGrid
            grid={grid}
            isVisualizing={isVisualizing}
            onResetVisualization={resetVisualization}
            onSetSourceCoord={updateSource}
            onSetTargetCoord={updateTarget}
            onSetWall={setWall}
          />
        </div>
        <Controls
          isVisualizing={isVisualizing}
          selectedAlgorithm={selectedAlgorithm}
          onSelectAlgorithm={onAlgorithmSelection}
          onVisualize={animate}
          onGenerateMaze={generateMaze}
          onResetGrid={resetGrid}
          onResetVisualization={resetVisualization}
        />
      </div>
    </MantineProvider>
  );
};
