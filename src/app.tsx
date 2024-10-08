import '@mantine/core/styles.css';
import { Grid } from './components/grid';
import './app.css';
import {
  ActionIcon,
  Button,
  createTheme,
  Flex,
  Group,
  MantineProvider,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { dijkstra } from './utils/pathfinding-algorithms/dijkstra';
import { aStar } from './utils/pathfinding-algorithms/a-star';
import { dfs } from './utils/pathfinding-algorithms/dfs';
import { useVisualizer } from './hooks/use-visualizer';
import { IconBrandGithubFilled } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

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
    setSourceNode,
    setTargetNode,
    setNumGridCols,
    setNumGridRows,
  } = useVisualizer();

  const [headerHeight, setHeaderHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const header = useRef<HTMLDivElement>(null);

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
    const numCols = Math.floor(windowWidth / 25);
    const numRows = Math.floor((windowHeight - headerHeight) / 25);
    setNumGridCols(numCols);
    setNumGridRows(numRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowHeight, windowWidth, headerHeight]);

  const onAlgorithmSelection = (algorithm: string) => {
    if (algorithm === "Dijkstra's") {
      setAlgorithm(() => dijkstra);
      return;
    }

    if (algorithm === 'A*') {
      setAlgorithm(() => aStar);
      return;
    }

    if (algorithm === 'DFS') {
      setAlgorithm(() => dfs);
      return;
    }
  };

  return (
    <MantineProvider theme={theme}>
      <Stack h={windowHeight} gap={0}>
        <Flex
          ref={header}
          align={'center'}
          gap="24"
          bg={'blue'}
          py={16}
          px={24}
          justify={'space-between'}
        >
          <Flex align={'center'} gap={24}>
            <Text size="xl" fw={800} c="white">
              Pathfinding Visualizer
            </Text>
            <Group>
              <Select
                onChange={(value) => onAlgorithmSelection(value!)}
                disabled={isVisualizing}
                data={["Dijkstra's", 'A*', 'DFS']}
                defaultValue="Dijkstra's"
                allowDeselect={false}
              />
              <Button variant="outline" color="white" onClick={animate} disabled={isVisualizing}>
                Visualize!
              </Button>
              <Button
                variant="outline"
                onClick={generateMaze}
                disabled={isVisualizing}
                color="white"
              >
                Generate Maze
              </Button>
              <Button variant="outline" color="white" onClick={resetGrid} disabled={isVisualizing}>
                Reset Grid
              </Button>
              <Button
                variant="outline"
                color="white"
                onClick={resetVisualization}
                disabled={isVisualizing}
              >
                Reset Visualization
              </Button>
            </Group>
          </Flex>
          <ActionIcon
            component="a"
            href="https://github.com/cheuyin/pathfinding-visualizer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandGithubFilled />
          </ActionIcon>
        </Flex>
        <Grid
          grid={grid}
          isVisualizing={isVisualizing}
          onResetVisualization={resetVisualization}
          onSetSourceCoord={setSourceNode}
          onSetTargetCoord={setTargetNode}
          onSetWall={setWall}
        />
      </Stack>
    </MantineProvider>
  );
};
