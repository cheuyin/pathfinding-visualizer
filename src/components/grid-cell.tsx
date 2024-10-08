import styled, { css, keyframes } from 'styled-components';
import { Node } from '../types/types';
import { NodeType } from '../types/enums';
import { IconMoodHappyFilled } from '@tabler/icons-react';
import { IconHomeFilled } from '@tabler/icons-react';
import { Flex, useMantineTheme } from '@mantine/core';

interface GridCellProps {
  node: Node;
  onBlankNodeClicked: (selectedNode: Node) => void;
  onMouseOver: (selectedNode: Node) => void;
  onSetTargetNode: (selectedNode: Node) => void;
  onSetSourceNode: (selectedNode: Node) => void;
  isVisualizing: boolean;
}

export const GridCell: React.FC<GridCellProps> = ({
  node,
  onBlankNodeClicked,
  onMouseOver,
  onSetTargetNode,
  onSetSourceNode,
  isVisualizing,
}) => {
  const theme = useMantineTheme();

  const handleOnMouseDown = () => {
    if (node.type === NodeType.BLANK) {
      onBlankNodeClicked(node);
    }
  };

  const handleOnDragStart: React.DragEventHandler<HTMLTableCellElement> = (event) => {
    event.dataTransfer.setData(
      'text',
      node.type === NodeType.SOURCE ? 'SOURCE' : node.type === NodeType.TARGET ? 'TARGET' : '',
    );
  };

  /**
   * Make cells droppable by preventing the event default (by default, elements can't be dropped into.)
   */
  const handleOnDragOver: React.DragEventHandler<HTMLTableCellElement> = (event) => {
    event.preventDefault();
  };

  const handleOnDrop: React.DragEventHandler<HTMLTableCellElement> = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    if (data === 'SOURCE') {
      onSetSourceNode(node);
    } else if (data === 'TARGET') {
      onSetTargetNode(node);
    }
  };

  return (
    <Cell
      $nodeType={node.type}
      onMouseOver={() => onMouseOver(node)}
      onMouseDown={handleOnMouseDown}
      draggable={!isVisualizing && (node.type === NodeType.SOURCE || node.type === NodeType.TARGET)}
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
};

const Cell = styled.td<{
  $nodeType: NodeType;
}>`
  border: 1px solid #9ae2ff;
  width: 25px;
  height: 25px;
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
  0% {
    transform: scale(.3);
    background-color: rgba(0, 0, 66, 0.75);
    border-radius: 100%;
  }

  50% {
    background-color: rgba(17, 104, 217, 0.75);
  }

  75% {
    transform: scale(1.2);
    background-color: rgba(0, 217, 159, 0.75);
  }

  100% {
    transform: scale(1.0);
    background-color: rgba(0, 190, 218, 0.75);
  }
`;

const pathNodeAnimation = keyframes`
  0% {
    transform: scale(.3);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1.0);
    background-color: yellow;
  }
`;

const wallNodeAnimation = keyframes`
  0% {
    transform: scale(.3);
    background-color: rgb(12, 53, 71);
  }

  50% {
    transform: scale(1.2);
    background-color: rgb(12, 53, 71);
  }

  100% {
    transform: scale(1.0);
    background-color: rgb(12, 53, 71);
  }
`;
