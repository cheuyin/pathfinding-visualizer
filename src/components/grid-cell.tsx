import styled from 'styled-components';
import { Node } from '../types/types';
import { NodeType } from '../types/enums';

interface GridCellProps {
  node: Node;
}

export const GridCell: React.FC<GridCellProps> = ({ node }) => {
  return <Cell bgColor={getBackgroundColor(node.type, node.visited)} />;
};

const Cell = styled.td<{ bgColor: string }>`
  border: 1px solid black;
  width: 25px;
  height: 25px;
  background-color: ${(props) => props.bgColor};
`;

const getBackgroundColor = (type: NodeType, isVisited: boolean): string => {
  if (type === NodeType.SOURCE) {
    return 'green';
  }

  if (type === NodeType.TARGET) {
    return 'red';
  }

  if (type === NodeType.PATH) {
    return 'lightblue';
  }

  if (isVisited) {
    return 'yellow';
  }

  return '';
};
