import { NodeType } from './enums';

export interface Node {
  x: number;
  y: number;
  type: NodeType;
}

export type Grid = Node[][];

export type CanvasGrid = Uint8Array;

export interface GridDimensions {
  width: number;
  height: number;
}

export interface Coord {
  x: number;
  y: number;
}

export type Algorithm = (
  grid: Grid,
  startCoord: Coord,
  targetCoord: Coord,
) => {
  visitedNodes: Coord[];
  pathToTarget: Coord[];
};

export type CanvasAlgorithm = (
  grid: CanvasGrid,
  dimensions: GridDimensions,
  startCoord: Coord,
  targetCoord: Coord,
) => {
  visitedNodes: Coord[];
  pathToTarget: Coord[];
};

export type MazeGenerationAlgorithm = (
  grid: Grid,
  startCoord: Coord,
  targetCoord: Coord,
) => Coord[];

export type CanvasMazeGenerationAlgorithm = (
  grid: CanvasGrid,
  dimensions: GridDimensions,
  startCoord: Coord,
  targetCoord: Coord,
) => Coord[];
