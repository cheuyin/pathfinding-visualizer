import styled from 'styled-components';
import { Node } from '../types/types';
import { NodeType } from '../types/enums';

interface GridCellProps {
  node: Node;
  onClick?: (selectedNode: Node) => void;
}

export const GridCell: React.FC<GridCellProps> = ({ node, onClick }) => {
  return <Cell $bgColor={getBackgroundColor(node.type)} onClick={() => onClick && onClick(node)} />;
};

const Cell = styled.td<{ $bgColor: string }>`
  border: 1px solid black;
  width: 25px;
  height: 25px;
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
