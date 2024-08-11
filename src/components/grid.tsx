import styled from 'styled-components';
import { GridCell } from './grid-cell';
import { useGrid } from '../hooks/use-grid';

export const Grid: React.FC = () => {
  const { grid } = useGrid();
  return (
    <Table>
      <tbody>
        {grid.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {row.map((node, colIdx) => (
              <GridCell key={`${colIdx} ${rowIdx}`} node={node} />
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const Table = styled.table`
  border-collapse: collapse;
`;
