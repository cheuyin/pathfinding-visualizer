import { forwardRef, useState } from 'react';
import { Text, Group, ActionIcon, Affix, Button, Image } from '@mantine/core';
import { IconBrandGithubFilled, IconSettings } from '@tabler/icons-react';
import { PathfindingAlgorithmRegistry } from '@/algorithms/pathfinding';
import { ControlsModal } from './controls-modal';
import favicon from '/favicon.png';

type PathfindingAlgorithmName = keyof typeof PathfindingAlgorithmRegistry;

interface HeaderControlsProps {
  isVisualizing: boolean;
  selectedAlgorithm: PathfindingAlgorithmName;
  onSelectAlgorithm: (id: PathfindingAlgorithmName) => void;
  onVisualize: () => void;
  onGenerateMaze: () => void;
  onResetGrid: () => void;
  onResetVisualization: () => void;
}

export const HeaderControls = forwardRef<HTMLDivElement, HeaderControlsProps>(
  (
    {
      isVisualizing,
      selectedAlgorithm,
      onSelectAlgorithm,
      onVisualize,
      onGenerateMaze,
      onResetGrid,
      onResetVisualization,
    },
    ref,
  ) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <>
        <div
          ref={ref}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            background: '#228be6', // Mantine default blue
          }}
        >
          <Group justify="space-between" align="center" style={{ padding: '12px 24px' }}>
            <Group align="center">
              <Image
                src={favicon}
                alt="Logo"
                width={24}
                height={24}
                style={{
                  filter: 'grayscale(1) brightness(1.5) contrast(1.2)',
                }}
              />
              <Text size="xl" fw={800} c="white">
                Pathfinding Visualizer
              </Text>
            </Group>
            <ActionIcon
              component="a"
              href="https://github.com/cheuyin/pathfinding-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              variant="transparent"
              c="white"
            >
              <IconBrandGithubFilled />
            </ActionIcon>
          </Group>
        </div>

        <Affix position={{ bottom: 20, right: 20 }}>
          <Button
            onClick={() => setIsModalOpen(true)}
            leftSection={<IconSettings size={14} />}
          >
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
  },
);

HeaderControls.displayName = 'HeaderControls';
