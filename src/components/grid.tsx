import styles from './grid.module.css';
import { createArrayFromNum } from '../utils/general-utils';

const NUM_COLS = 50;
const NUM_ROWS = 25;

export const Grid = () => {
  return (
    <table className={styles.grid}>
      {createArrayFromNum(NUM_ROWS).map((rowId) => (
        <tr key={rowId}>
          {createArrayFromNum(NUM_COLS).map((colId) => (
            <td key={`${rowId} ${colId}`} className={styles.node}></td>
          ))}
        </tr>
      ))}
    </table>
  );
};
