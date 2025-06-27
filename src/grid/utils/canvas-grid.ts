import { NodeType } from '../../types/enums';
import { CanvasGrid, GridDimensions, Coord, Grid } from '../../types/types';

export const createCanvasGrid = (width: number, height: number): CanvasGrid => {
  return new Uint8Array(width * height).fill(NodeType.BLANK);
};

export const coordToIndex = (coord: Coord, dimensions: GridDimensions): number => {
  return coord.y * dimensions.width + coord.x;
};

export const indexToCoord = (index: number, dimensions: GridDimensions): Coord => {
  return {
    x: index % dimensions.width,
    y: Math.floor(index / dimensions.width),
  };
};

export const getCanvasCell = (
  grid: CanvasGrid,
  coord: Coord,
  dimensions: GridDimensions,
): NodeType => {
  return grid[coordToIndex(coord, dimensions)];
};

export const setCanvasCell = (
  grid: CanvasGrid,
  coord: Coord,
  dimensions: GridDimensions,
  nodeType: NodeType,
): void => {
  grid[coordToIndex(coord, dimensions)] = nodeType;
};

export const convertGridToCanvas = (grid: Grid, dimensions: GridDimensions): CanvasGrid => {
  const canvasGrid = createCanvasGrid(dimensions.width, dimensions.height);

  for (let y = 0; y < dimensions.height; y++) {
    for (let x = 0; x < dimensions.width; x++) {
      if (grid[y] && grid[y][x]) {
        setCanvasCell(canvasGrid, { x, y }, dimensions, grid[y][x].type);
      }
    }
  }

  return canvasGrid;
};

export const convertCanvasToGrid = (canvasGrid: CanvasGrid, dimensions: GridDimensions): Grid => {
  const grid: Grid = [];

  for (let y = 0; y < dimensions.height; y++) {
    grid[y] = [];
    for (let x = 0; x < dimensions.width; x++) {
      grid[y][x] = {
        x,
        y,
        type: getCanvasCell(canvasGrid, { x, y }, dimensions),
      };
    }
  }

  return grid;
};

export const copyCanvasGrid = (grid: CanvasGrid): CanvasGrid => {
  return new Uint8Array(grid);
};

export const clearCanvasVisualization = (grid: CanvasGrid): void => {
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === NodeType.VISITED || grid[i] === NodeType.PATH) {
      grid[i] = NodeType.BLANK;
    }
  }
};
