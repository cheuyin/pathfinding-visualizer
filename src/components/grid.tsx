import styled from 'styled-components';
import { GridCell } from './grid-cell';
import { useGrid } from '../hooks/use-grid';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';
import { aStar } from '../utils/pathfinding-algorithms/a-star';

export const Grid: React.FC = () => {
  const { grid, setWall, isPaused, toggleVisualization, resetGrid, setAlgorithm } = useGrid();

  const handleAlgorithmSelection: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (event.target.value === "Dijkstra's") {
      setAlgorithm(() => dijkstra);
      return;
    }

    if (event.target.value === 'A*') {
      setAlgorithm(() => aStar);
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
      <button onClick={toggleVisualization}>{isPaused ? 'Start' : 'Pause'}</button>
      <button onClick={resetGrid}>Reset</button>
      <select onChange={handleAlgorithmSelection}>
        <option value="Dijkstra's">Dijkstra's</option>
        <option value="A*">A*</option>
      </select>
    </div>
  );
};

const Table = styled.table`
  border-collapse: collapse;
`;
