import { Node } from '../types/types';
import './grid-cell.css';

interface GridCellProps {
  node: Node;
  onClick?: (selectedNode: Node) => void;
}

export const GridCell: React.FC<GridCellProps> = ({ node, onClick }) => {
  return (
    <td
      id={`GridCell-${node.x}-${node.y}`}
      className={'GridCell'}
      onClick={() => onClick && onClick(node)}
    />
  );
};
