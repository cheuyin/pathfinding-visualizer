import styled from 'styled-components';
import { GridCell } from './grid-cell';
import { useVisualizer } from '../hooks/use-visualizer';
import { dijkstra } from '../utils/pathfinding-algorithms/dijkstra';
// import { aStar } from '../utils/pathfinding-algorithms/a-star';

export const Grid: React.FC = () => {
  const { grid, setWall, visualize, resetGrid, setAlgorithm } = useVisualizer();

  const handleAlgorithmSelection: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (event.target.value === "Dijkstra's") {
      setAlgorithm(() => dijkstra);
      return;
    }

    // if (event.target.value === 'A*') {
    //   setAlgorithm(() => aStar);
    //   return;
    // }
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
      <button onClick={visualize}>{'Visualize'}</button>
      <button onClick={resetGrid}>Reset</button>
      <select onChange={handleAlgorithmSelection}>
        <option value="Dijkstra's">Dijkstra's</option>
        {/* <option value="A*">A*</option> */}
      </select>
    </div>
  );
};

const Table = styled.table`
  border-collapse: collapse;
`;
