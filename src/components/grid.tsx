import styled from 'styled-components';
import { GridCell } from './grid-cell';
import { useEffect, useState } from 'react';
import { Center } from '@mantine/core';
import { Coord, Grid as GridType, Node } from '../types/types';

interface GridProps {
  grid: GridType;
  isVisualizing: boolean;
  onSetWall: (node: Node) => void;
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

  return (
    <>
      <Center>
        <Table>
          <tbody>
            {grid.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((node, colIdx) => (
                  <GridCell
                    key={`${colIdx} ${rowIdx}`}
                    node={node}
                    onMouseOver={(node) => {
                      if (isMakingWalls) {
                        onSetWall(node);
                      }
                    }}
                    onBlankNodeClicked={(node) => {
                      setIsMakingWalls(true);
                      onSetWall(node);
                    }}
                    onSetSourceNode={(node) => {
                      onSetSourceCoord({
                        x: node.x,
                        y: node.y,
                      });
                      onResetVisualization();
                    }}
                    onSetTargetNode={(node) => {
                      onSetTargetCoord({
                        x: node.x,
                        y: node.y,
                      });
                      onResetVisualization();
                    }}
                    isVisualizing={isVisualizing}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Center>
    </>
  );
};

const Table = styled.table`
  border-collapse: collapse;
`;
