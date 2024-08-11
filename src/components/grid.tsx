import styled from 'styled-components';
import { Node } from '../types/types';
import { GridCell } from './grid-cell';

interface GridProps {
  grid: Node[][];
}

export const Grid: React.FC<GridProps> = ({ grid }) => {
  return (
    <Table>
      {grid.map((row, rowIdx) => (
        <tr key={rowIdx}>
          {row.map((_, colIdx) => (
            <GridCell key={`${colIdx} ${rowIdx}`} />
          ))}
        </tr>
      ))}
    </Table>
  );
};

const Table = styled.table`
  border-collapse: collapse;
`;
