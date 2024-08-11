import styles from './grid.module.css';
import { Node } from '../types/types';
import { GridCell } from './grid-cell';

interface GridProps {
  grid: Node[][];
}

export const Grid: React.FC<GridProps> = ({ grid }) => {
  return (
    <table className={styles.grid}>
      {grid.map((row, rowIdx) => (
        <tr key={rowIdx}>
          {row.map((_, colIdx) => (
            <GridCell key={`${colIdx} ${rowIdx}`} />
          ))}
        </tr>
      ))}
    </table>
  );
};
