import styled from 'styled-components';
import { GridCell } from './grid-cell';
import { useVisualizer } from '../hooks/use-visualizer';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';
import { aStar } from '../utils/pathfinding-algorithms/a-star';
import { dfs } from '../utils/pathfinding-algorithms/dfs';

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
  } = useVisualizer();

  const handleAlgorithmSelection: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (event.target.value === "Dijkstra's") {
      setAlgorithm(() => dijkstra);
      return;
    }

    if (event.target.value === 'A*') {
      setAlgorithm(() => aStar);
      return;
    }

    if (event.target.value === 'DFS') {
      setAlgorithm(() => dfs);
      return;
    }
  };

  return (
    <div>
      <Table>
        <tbody>
          {grid.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((node, colIdx) => (
                <GridCell key={`${colIdx} ${rowIdx}`} node={node} onClick={setWall} />
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <button onClick={animate} disabled={isVisualizing}>
        {'Visualize'}
      </button>
      <button onClick={resetGrid} disabled={isVisualizing}>
        Reset Grid
      </button>
      <button onClick={resetVisualization} disabled={isVisualizing}>
        Reset Visualization
      </button>
      <select onChange={handleAlgorithmSelection} disabled={isVisualizing}>
        <option value="Dijkstra's">Dijkstra's</option>
        <option value="A*">A*</option>
        <option value="DFS">DFS</option>
      </select>
      <button onClick={generateMaze} disabled={isVisualizing}>
        Generate Maze
      </button>
    </div>
  );
};

const Table = styled.table`
  border-collapse: collapse;
`;
