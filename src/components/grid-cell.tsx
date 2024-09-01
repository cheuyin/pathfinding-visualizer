import styled, { css, keyframes } from 'styled-components';
import { Node } from '../types/types';
import { NodeType } from '../types/enums';

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
      $bgColor={getBackgroundColor(node.type)}
      $nodeType={node.type}
      onMouseOver={() => onMouseOver(node)}
      onMouseDown={handleOnMouseDown}
      draggable={!isVisualizing && (node.type === NodeType.SOURCE || node.type === NodeType.TARGET)}
      onDragStart={handleOnDragStart}
      onDragOver={handleOnDragOver}
      onDrop={handleOnDrop}
    />
  );
};

const Cell = styled.td<{
  $bgColor: string;
  $nodeType: NodeType;
}>`
  border: 1px solid black;
  width: 25px;
  height: 25px;
  background-color: ${(props) => props.$bgColor};
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
      : null}
`;

const getBackgroundColor = (type: NodeType): string => {
  if (type === NodeType.SOURCE) {
    return 'green';
  }

  if (type === NodeType.TARGET) {
    return 'red';
  }

  return '';
};

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
