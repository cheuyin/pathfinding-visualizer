import styled from 'styled-components';
import { Node } from '../types/types';
import { NodeType } from '../types/enums';

interface GridCellProps {
  node: Node;
  onBlankNodeClicked: (selectedNode: Node) => void;
  onMouseOver: (selectedNode: Node) => void;
}

export const GridCell: React.FC<GridCellProps> = ({ node, onBlankNodeClicked, onMouseOver }) => {
  const handleOnMouseDown = () => {
    if (node.type === NodeType.BLANK) {
      onBlankNodeClicked(node);
    }
  };

  return (
    <Cell
      $bgColor={getBackgroundColor(node.type)}
      onMouseOver={() => onMouseOver(node)}
      onMouseDown={handleOnMouseDown}
      draggable={node.type === NodeType.SOURCE || node.type === NodeType.TARGET}
    />
  );
};

const Cell = styled.td<{ $bgColor: string }>`
  border: 1px solid black;
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.$bgColor};
`;

const getBackgroundColor = (type: NodeType): string => {
  if (type === NodeType.SOURCE) {
    return 'green';
  }

  if (type === NodeType.TARGET) {
    return 'red';
  }

  if (type === NodeType.PATH) {
    return 'yellow';
  }

  if (type === NodeType.WALL) {
    return 'gray';
  }

  if (type === NodeType.VISITED) {
    return 'lightblue';
  }

  return '';
};
