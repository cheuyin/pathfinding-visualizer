import styled from 'styled-components';
import { GridCell } from './grid-cell';
import { useGrid } from '../hooks/use-grid';

export const Grid: React.FC = () => {
  const { grid, setWall, isPaused, toggleVisualization, resetGrid } = useGrid();

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
    </div>
  );
};

const Table = styled.table`
  border-collapse: collapse;
`;
