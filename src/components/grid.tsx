import styled from 'styled-components';
import { Grid as GridType } from '../types/types';
import { GridCell } from './grid-cell';

interface GridProps {
  grid: GridType;
}

export const Grid: React.FC<GridProps> = ({ grid }) => {
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
