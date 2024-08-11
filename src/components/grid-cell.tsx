import styled from 'styled-components';
import { Node } from '../types/types';
import { NodeState } from '../types/enums';

interface GridCellProps {
  node: Node;
}

export const GridCell: React.FC<GridCellProps> = ({ node }) => {
  console.log;
  switch (node.type) {
    case NodeState.NORMAL:
      return <Cell />;
    case NodeState.SOURCE:
      return <SourceCell />;
    case NodeState.TARGET:
      return <TargetCell />;
    default:
      return <Cell />;
  }
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
