import styled from 'styled-components';
import { GridCell } from './grid-cell';
import { useVisualizer } from '../hooks/use-visualizer';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';
import { aStar } from '../utils/pathfinding-algorithms/a-star';
import { dfs } from '../utils/pathfinding-algorithms/dfs';
import { useEffect, useState } from 'react';
import { Button, Center, Select } from '@mantine/core';

export const Grid: React.FC = () => {
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

  const [isMakingWalls, setIsMakingWalls] = useState(false);

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

  useEffect(() => {
    const handleMouseUp = () => {
      if (isMakingWalls) {
        setIsMakingWalls(false);
      }
    };

    if (isMakingWalls) {
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMakingWalls]);

  return (
    <>
      <Center>
        <Table>
          <tbody>
            {grid.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((node, colIdx) => (
                  <GridCell
                    key={`${colIdx} ${rowIdx}`}
                    node={node}
                    onMouseOver={(node) => {
                      if (isMakingWalls) {
                        setWall(node);
                      }
                    }}
                    onBlankNodeClicked={(node) => {
                      setIsMakingWalls(true);
                      setWall(node);
                    }}
                    onSetSourceNode={(node) => {
                      setSourceCoord({
                        x: node.x,
                        y: node.y,
                      });
                      resetVisualization();
                    }}
                    onSetTargetNode={(node) => {
                      setTargetCoord({
                        x: node.x,
                        y: node.y,
                      });
                      resetVisualization();
                    }}
                    isVisualizing={isVisualizing}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Center>
      <Button variant="filled" onClick={animate} disabled={isVisualizing}>
        {'Visualize'}
      </Button>
      <Button onClick={resetGrid} disabled={isVisualizing}>
        Reset Grid
      </Button>
      <Button onClick={resetVisualization} disabled={isVisualizing}>
        Reset Visualization
      </Button>
      <Select
        onChange={(value) => onAlgorithmSelection(value!)}
        disabled={isVisualizing}
        data={["Dijkstra's", 'A*', 'DFS']}
        defaultValue="Dijkstra's"
      />
      <Button onClick={generateMaze} disabled={isVisualizing}>
        Generate Maze
      </Button>
    </>
  );
};

const Table = styled.table`
  border-collapse: collapse;
`;
