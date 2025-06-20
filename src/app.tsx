import '@mantine/core/styles.css';
import { Grid } from '@/grid/components/grid';
import { HeaderControls } from '@/ui';
import './app.css';
import { createTheme, MantineProvider, Stack } from '@mantine/core';
import { PathfindingAlgorithmRegistry } from '@/algorithms/';
import { useVisualizer } from './hooks/use-visualizer';
import { useEffect, useRef, useState } from 'react';
import { CELL_SIZE_PX } from './constants';

const theme = createTheme({});

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
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const header = useRef<HTMLDivElement>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Dijkstra's");

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
      if (header.current) {
        setHeaderHeight(header.current.offsetHeight);
      }
    };

    if (header.current) {
      setHeaderHeight(header.current.offsetHeight);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const numCols = Math.floor(windowWidth / CELL_SIZE_PX);
    const numRows = Math.floor((windowHeight - headerHeight) / CELL_SIZE_PX);
    setNumGridCols(numCols);
    setNumGridRows(numRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowHeight, windowWidth, headerHeight]);

  const onAlgorithmSelection = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
    if (algorithm === "Dijkstra's") {
      setAlgorithm(() => PathfindingAlgorithmRegistry["Dijkstra's"]);
      return;
    }

    if (algorithm === 'A*') {
      setAlgorithm(() => PathfindingAlgorithmRegistry['A*']);
      return;
    }

    if (algorithm === 'DFS') {
      setAlgorithm(() => PathfindingAlgorithmRegistry.DFS);
      return;
    }
  };

  return (
    <MantineProvider theme={theme}>
      <Stack h={windowHeight} gap={0}>
        <HeaderControls
          ref={header}
          isVisualizing={isVisualizing}
          selectedAlgorithm={selectedAlgorithm}
          onSelectAlgorithm={onAlgorithmSelection}
          onVisualize={animate}
          onGenerateMaze={generateMaze}
          onResetGrid={resetGrid}
          onResetVisualization={resetVisualization}
        />
        <Grid
          grid={grid}
          isVisualizing={isVisualizing}
          onResetVisualization={resetVisualization}
          onSetSourceCoord={updateSource}
          onSetTargetCoord={updateTarget}
          onSetWall={setWall}
        />
      </Stack>
    </MantineProvider>
  );
};
