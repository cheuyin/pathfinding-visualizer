import '@mantine/core/styles.css';
import { CanvasGrid } from '@/grid/components/canvas-grid';
import { HeaderControls } from '@/ui';
import './app.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { PathfindingAlgorithmRegistry } from '@/algorithms/pathfinding';
import { useVisualizer } from './hooks/use-visualizer';
import { useEffect, useRef, useState } from 'react';
import { CELL_SIZE_PX } from './constants';
import { FPSCounter } from '@/utils/fps-counter';

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

  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<PathfindingAlgorithmName>("Dijkstra's");

  useEffect(() => {
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
      const numCols = Math.floor(window.innerWidth / CELL_SIZE_PX);
      const numRows = Math.floor((window.innerHeight - (headerRef.current?.offsetHeight ?? 0)) / CELL_SIZE_PX);
      setNumGridCols(numCols);
      setNumGridRows(numRows);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
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
      <FPSCounter />
      <HeaderControls
        ref={headerRef}
        isVisualizing={isVisualizing}
        selectedAlgorithm={selectedAlgorithm}
        onSelectAlgorithm={onAlgorithmSelection}
        onVisualize={animate}
        onGenerateMaze={generateMaze}
        onResetGrid={resetGrid}
        onResetVisualization={resetVisualization}
      />
      <div style={{ paddingTop: headerHeight }}>
        <CanvasGrid
          grid={grid}
          isVisualizing={isVisualizing}
          onResetVisualization={resetVisualization}
          onSetSourceCoord={updateSource}
          onSetTargetCoord={updateTarget}
          onSetWall={setWall}
        />
      </div>
    </MantineProvider>
  );
};
