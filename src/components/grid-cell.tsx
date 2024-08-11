import styled from 'styled-components';
import { Node } from '../types/types';
import { NodeType } from '../types/enums';

interface GridCellProps {
  node: Node;
}

export const GridCell: React.FC<GridCellProps> = ({ node }) => {
  if (node.type === NodeType.SOURCE) {
    return <SourceCell />;
  }

  if (node.type === NodeType.TARGET) {
    return <TargetCell />;
  }

  if (node.type === NodeType.PATH) {
    return <PathCell />;
  }

  if (node.visited) {
    return <VisitedCell />;
  }

  return <Cell />;
};

const Cell = styled.td`
  border: 1px solid black;
  width: 25px;
  height: 25px;
`;

const SourceCell = styled(Cell)`
  background-color: green;
`;

const TargetCell = styled(Cell)`
  background-color: red;
`;

const PathCell = styled(Cell)`
  background-color: lightblue;
`;

const VisitedCell = styled(Cell)`
  background-color: yellow;
`;
