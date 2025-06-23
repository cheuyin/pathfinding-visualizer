import styled from 'styled-components';
import { GridCell } from './grid-cell';
import { useCallback, useEffect, useState } from 'react';
import { Coord, Grid as GridType } from '@/types/types';

interface GridProps {
  grid: GridType;
  isVisualizing: boolean;
  onSetWall: (coord: Coord) => void;
  onSetSourceCoord: (coord: Coord) => void;
  onSetTargetCoord: (coord: Coord) => void;
  onResetVisualization: () => void;
}

export const Grid: React.FC<GridProps> = ({
  grid,
  isVisualizing,
  onSetWall,
  onSetSourceCoord,
  onSetTargetCoord,
  onResetVisualization,
}) => {
  const [isMakingWalls, setIsMakingWalls] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      if (isMakingWalls) {
        setIsMakingWalls(false);
      }
    };

    if (isMakingWalls) {
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMakingWalls]);

  const handleMouseOver = useCallback(
    (coord: Coord) => {
      if (isMakingWalls) {
        onSetWall(coord);
      }
    },
    [isMakingWalls, onSetWall],
  );

  const handleBlankNodeClicked = useCallback(
    (coord: Coord) => {
      setIsMakingWalls(true);
      onSetWall(coord);
    },
    [onSetWall],
  );

  const handleSetSourceNode = useCallback(
    (coord: Coord) => {
      onSetSourceCoord(coord);
      onResetVisualization();
    },
    [onSetSourceCoord, onResetVisualization],
  );

  const handleSetTargetNode = useCallback(
    (coord: Coord) => {
      onSetTargetCoord(coord);
      onResetVisualization();
    },
    [onSetTargetCoord, onResetVisualization],
  );

  return (
    <Table>
      <tbody>
        {grid.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {row.map((node, colIdx) => (
              <GridCell
                key={`${colIdx} ${rowIdx}`}
                node={node}
                onMouseOver={handleMouseOver}
                onBlankNodeClicked={handleBlankNodeClicked}
                onSetSourceNode={handleSetSourceNode}
                onSetTargetNode={handleSetTargetNode}
                isVisualizing={isVisualizing}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const Table = styled.table`
  border-collapse: collapse;
  flex: 1;
  overflow: hidden;
`;
