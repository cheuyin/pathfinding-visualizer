import { useState } from 'react';
import { Affix, Button, Stack } from '@mantine/core';
import { IconSettings, IconPlayerPlayFilled } from '@tabler/icons-react';
import { PathfindingAlgorithmRegistry } from '@/algorithms/pathfinding';
import { ControlsModal } from './controls-modal';

type PathfindingAlgorithmName = keyof typeof PathfindingAlgorithmRegistry;

interface ControlsProps {
  isVisualizing: boolean;
  selectedAlgorithm: PathfindingAlgorithmName;
  onSelectAlgorithm: (id: PathfindingAlgorithmName) => void;
  onVisualize: () => void;
  onGenerateMaze: () => void;
  onResetGrid: () => void;
  onResetVisualization: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isVisualizing,
  selectedAlgorithm,
  onSelectAlgorithm,
  onVisualize,
  onGenerateMaze,
  onResetGrid,
  onResetVisualization,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Affix position={{ bottom: 40, right: 40 }}>
        <Stack>
          <Button
            onClick={onVisualize}
            disabled={isVisualizing}
            leftSection={<IconPlayerPlayFilled size={14} />}
            size="lg"
          >
            Visualize
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            leftSection={<IconSettings size={14} />}
            variant="white"
            size="sm"
          >
            Controls
          </Button>
        </Stack>
      </Affix>

      <ControlsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isVisualizing={isVisualizing}
        selectedAlgorithm={selectedAlgorithm}
        onSelectAlgorithm={onSelectAlgorithm}
        onGenerateMaze={onGenerateMaze}
        onResetGrid={onResetGrid}
        onResetVisualization={onResetVisualization}
      />
    </>
  );
};
