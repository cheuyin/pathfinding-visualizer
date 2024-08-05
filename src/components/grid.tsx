import styles from './grid.module.css';
import { createArrayFromNum } from '../utils/utils';
import { Node } from './node';
import { Coordinate } from '../types/types';

interface GridProps {
  numRows: number;
  numCols: number;
  startNode: Coordinate;
  targetNode: Coordinate;
}

export const Grid: React.FC<GridProps> = ({ numRows, numCols, startNode, targetNode }) => {
  return (
    <table className={styles.grid}>
      {createArrayFromNum(numRows).map((rowId) => (
        <tr key={rowId}>
          {createArrayFromNum(numCols).map((colId) => (
            <Node
              key={`${rowId} ${colId}`}
              isStartNode={rowId === startNode.rowId && colId === startNode.colId}
              isTargetNode={rowId === targetNode.rowId && colId === targetNode.colId}
            />
          ))}
        </tr>
      ))}
    </table>
  );
};
