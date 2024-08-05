import styles from './node.module.css';

interface NodeProps {
  isStartNode: boolean;
  isTargetNode: boolean;
}

export const Node: React.FC<NodeProps> = ({ isStartNode, isTargetNode }) => {
  return (
    <td
      className={`${styles.node} ${isStartNode && styles.startNode} ${
        isTargetNode && styles.targetNode
      }`}
    />
  );
};
