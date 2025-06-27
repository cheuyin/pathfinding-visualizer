import { Modal, Select, Button, Stack } from '@mantine/core';
import { IconPlayerPlayFilled, IconReload } from '@tabler/icons-react';
import { PathfindingAlgorithmRegistry } from '@/algorithms/pathfinding';

type PathfindingAlgorithmName = keyof typeof PathfindingAlgorithmRegistry;

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVisualizing: boolean;
  selectedAlgorithm: PathfindingAlgorithmName;
  onSelectAlgorithm: (id: PathfindingAlgorithmName) => void;
  onVisualize: () => void;
  onGenerateMaze: () => void;
  onResetGrid: () => void;
  onResetVisualization: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({
  isOpen,
  onClose,
  isVisualizing,
  selectedAlgorithm,
  onSelectAlgorithm,
  onVisualize,
  onGenerateMaze,
  onResetGrid,
  onResetVisualization,
}) => {
  const pathfindingOptions = Object.keys(
    PathfindingAlgorithmRegistry,
  ) as PathfindingAlgorithmName[];

  return (
    <Modal opened={isOpen} onClose={onClose} title="Controls">
      <Stack>
        <Select
          label="Algorithm"
          onChange={(value) => value && onSelectAlgorithm(value as PathfindingAlgorithmName)}
          disabled={isVisualizing}
          data={pathfindingOptions}
          value={selectedAlgorithm}
          allowDeselect={false}
        />
        <Button
          onClick={onVisualize}
          disabled={isVisualizing}
          leftSection={<IconPlayerPlayFilled size={14} />}
        >
          Visualize
        </Button>
        <Button onClick={onGenerateMaze} disabled={isVisualizing}>
          Generate Maze
        </Button>
        <Button onClick={onResetGrid} disabled={isVisualizing}>
          Reset Grid
        </Button>
        <Button
          onClick={onResetVisualization}
          disabled={isVisualizing}
          leftSection={<IconReload size={14} />}
        >
          Reset Visualization
        </Button>
      </Stack>
    </Modal>
  );
};
