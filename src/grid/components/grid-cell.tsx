import styled, { css, keyframes } from 'styled-components';
import { Coord, Node } from '@/types/types';
import { NodeType } from '@/types/enums';
import { IconMoodHappyFilled, IconHomeFilled } from '@tabler/icons-react';
import { Flex, useMantineTheme } from '@mantine/core';
import { CELL_SIZE_PX } from '@/constants';
import { memo } from 'react';

interface GridCellProps {
  node: Node;
  onBlankNodeClicked: (coord: Coord) => void;
  onMouseOver: (coord: Coord) => void;
  onSetTargetNode: (coord: Coord) => void;
  onSetSourceNode: (coord: Coord) => void;
  isDraggable: boolean;
}

export const GridCell: React.FC<GridCellProps> = memo(
  ({ node, onBlankNodeClicked, onMouseOver, onSetTargetNode, onSetSourceNode, isDraggable }) => {
    const theme = useMantineTheme();
    const coord = { x: node.x, y: node.y };

    const handleOnMouseDown = () => {
      if (node.type === NodeType.BLANK) {
        onBlankNodeClicked(coord);
      }
    };

    const handleOnDragStart: React.DragEventHandler<HTMLTableCellElement> = (event) => {
      event.dataTransfer.setData(
        'text',
        node.type === NodeType.SOURCE ? 'SOURCE' : node.type === NodeType.TARGET ? 'TARGET' : '',
      );
    };

    const handleOnDragOver: React.DragEventHandler<HTMLTableCellElement> = (event) => {
      event.preventDefault();
    };

    const handleOnDrop: React.DragEventHandler<HTMLTableCellElement> = (event) => {
      event.preventDefault();
      const data = event.dataTransfer.getData('text');
      if (data === 'SOURCE') {
        onSetSourceNode(coord);
      } else if (data === 'TARGET') {
        onSetTargetNode(coord);
      }
    };

    return (
      <Cell
        $nodeType={node.type}
        onMouseOver={() => onMouseOver(coord)}
        onMouseDown={handleOnMouseDown}
        draggable={isDraggable}
        onDragStart={handleOnDragStart}
        onDragOver={handleOnDragOver}
        onDrop={handleOnDrop}
      >
        <Flex w="100%" h="100%" align={'center'} justify={'center'}>
          {node.type === NodeType.SOURCE && (
            <IconMoodHappyFilled size={20} color={theme.colors.blue[8]} />
          )}
          {node.type === NodeType.TARGET && (
            <IconHomeFilled size={20} color={theme.colors.yellow[8]} />
          )}
        </Flex>
      </Cell>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the node or isDraggable props actually changed
    return (
      prevProps.node.type === nextProps.node.type &&
      prevProps.node.x === nextProps.node.x &&
      prevProps.node.y === nextProps.node.y &&
      prevProps.isDraggable === nextProps.isDraggable
    );
  },
);

const Cell = styled.td<{
  $nodeType: NodeType;
}>`
  border: 1px solid #9ae2ff;
  width: ${CELL_SIZE_PX}px;
  height: ${CELL_SIZE_PX}px;
  cursor: ${(props) =>
    (props.$nodeType === NodeType.SOURCE || props.$nodeType === NodeType.TARGET) && 'pointer'};
  ${(props) =>
    props.$nodeType === NodeType.VISITED
      ? css`
          animation: ${visitedNodeAnimation} 2s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        `
      : props.$nodeType === NodeType.PATH
        ? css`
            animation: ${pathNodeAnimation} 1s;
            animation-timing-function: ease-out;
            animation-fill-mode: forwards;
          `
        : props.$nodeType === NodeType.WALL
          ? css`
              animation: ${wallNodeAnimation} 0.25s;
              animation-timing-function: ease-in;
              animation-fill-mode: forwards;
            `
          : null};
`;

const visitedNodeAnimation = keyframes`
  0% { transform: scale(.3); background-color: rgba(0,0,66,.75); border-radius:100%; }
  50% { background-color: rgba(17,104,217,.75); }
  75% { transform: scale(1.2); background-color: rgba(0,217,159,.75); }
  100% { transform: scale(1.0); background-color: rgba(0,190,218,.75); }
`;

const pathNodeAnimation = keyframes`
  0% { transform: scale(.3); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1.0); background-color: yellow; }
`;

const wallNodeAnimation = keyframes`
  0% { transform: scale(.3); background-color: rgb(12,53,71); }
  50% { transform: scale(1.2); background-color: rgb(12,53,71); }
  100% { transform: scale(1.0); background-color: rgb(12,53,71); }
`;
