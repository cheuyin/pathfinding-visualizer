import { Node } from '../types/types';
import { NodeType } from '../types/enums';
import './grid-cell.css';

interface GridCellProps {
  node: Node;
  onClick?: (selectedNode: Node) => void;
}

export const GridCell: React.FC<GridCellProps> = ({ node, onClick }) => {
  const additionalClassName =
    node.type === NodeType.SOURCE
      ? 'GridCell--source'
      : node.type === NodeType.TARGET
      ? 'GridCell--target'
      : node.type === NodeType.WALL
      ? 'GridCell--wall'
      : null;

  return (
    <td
      id={`GridCell-${node.x}-${node.y}`}
      className={`GridCell ${additionalClassName}`}
      onClick={() => onClick && onClick(node)}
    />
  );
};
