import { Text, Group, ActionIcon, Image } from '@mantine/core';
import { IconBrandGithubFilled } from '@tabler/icons-react';
import favicon from '/favicon.png';

export const Header: React.FC = () => {
  return (
    <div
      style={{
        background: '#228be6', // Mantine default blue
        zIndex: 1,
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
  );
};
