import '@mantine/core/styles.css';
import { Grid } from './components/grid';
import './app.css';
import { Button, createTheme, Flex, Group, MantineProvider, Select, Text } from '@mantine/core';
import { dijkstra } from './utils/pathfinding-algorithms/dijkstra';
import { aStar } from './utils/pathfinding-algorithms/a-star';
import { dfs } from './utils/pathfinding-algorithms/dfs';
import { useVisualizer } from './hooks/use-visualizer';

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
    setSourceCoord,
    setTargetCoord,
  } = useVisualizer();

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
      <Flex align={'center'} gap={40} bg={'blue'} py={16} px={24}>
        <Text size="xl" fw={800} c="white">
          Pathfinding Algorithm
        </Text>
        <Group>
          <Select
            onChange={(value) => onAlgorithmSelection(value!)}
            disabled={isVisualizing}
            data={["Dijkstra's", 'A*', 'DFS']}
            defaultValue="Dijkstra's"
            allowDeselect={false}
          />
          <Button
            variant="filled"
            color="white"
            c="dark"
            onClick={animate}
            disabled={isVisualizing}
          >
            {'Visualize'}
          </Button>
          <Button variant="outline" onClick={generateMaze} disabled={isVisualizing} color="white">
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
      <Grid
        grid={grid}
        isVisualizing={isVisualizing}
        onResetVisualization={resetVisualization}
        onSetSourceCoord={setSourceCoord}
        onSetTargetCoord={setTargetCoord}
        onSetWall={setWall}
      />
    </MantineProvider>
  );
};
