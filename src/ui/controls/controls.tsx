import { useState } from 'react';
import { Affix, Button } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
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
      <Affix position={{ bottom: 20, right: 20 }}>
        <Button onClick={() => setIsModalOpen(true)} leftSection={<IconSettings size={14} />}>
          Controls
        </Button>
      </Affix>

      <ControlsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isVisualizing={isVisualizing}
        selectedAlgorithm={selectedAlgorithm}
        onSelectAlgorithm={onSelectAlgorithm}
        onVisualize={onVisualize}
        onGenerateMaze={onGenerateMaze}
        onResetGrid={onResetGrid}
        onResetVisualization={onResetVisualization}
      />
    </>
  );
};
