import { forwardRef } from 'react';
import {
    ActionIcon,
    Button,
    Flex,
    Group,
    Select,
    Text,
} from '@mantine/core';
import { IconBrandGithubFilled } from '@tabler/icons-react';

interface HeaderControlsProps {
    isVisualizing: boolean;
    selectedAlgorithm: string;
    onSelectAlgorithm: (label: string) => void;
    onVisualize: () => void;
    onGenerateMaze: () => void;
    onResetGrid: () => void;
    onResetVisualization: () => void;
}

// Forward ref so parent can measure height
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
        return (
            <Flex
                ref={ref}
                align="center"
                gap="24"
                bg="blue"
                py={16}
                px={24}
                justify="space-between"
            >
                <Flex align="center" gap={24}>
                    <Text size="xl" fw={800} c="white">
                        Pathfinding Visualizer
                    </Text>
                    <Group>
                        <Select
                            onChange={(value) => value && onSelectAlgorithm(value)}
                            disabled={isVisualizing}
                            data={["Dijkstra's", 'A*', 'DFS']}
                            value={selectedAlgorithm}
                            allowDeselect={false}
                        />
                        <Button variant="outline" color="white" onClick={onVisualize} disabled={isVisualizing}>
                            Visualize!
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onGenerateMaze}
                            disabled={isVisualizing}
                            color="white"
                        >
                            Generate Maze
                        </Button>
                        <Button variant="outline" color="white" onClick={onResetGrid} disabled={isVisualizing}>
                            Reset Grid
                        </Button>
                        <Button
                            variant="outline"
                            color="white"
                            onClick={onResetVisualization}
                            disabled={isVisualizing}
                        >
                            Reset Visualization
                        </Button>
                    </Group>
                </Flex>
                <ActionIcon
                    component="a"
                    href="https://github.com/cheuyin/pathfinding-visualizer"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <IconBrandGithubFilled />
                </ActionIcon>
            </Flex>
        );
    },
);

HeaderControls.displayName = 'HeaderControls'; 