import React, { useRef, useEffect, useCallback, useState } from 'react';
import { NodeType } from '@/types/enums';
import { Coord, Grid as GridType } from '@/types/types';
import { CELL_SIZE_PX } from '@/constants';

interface CanvasGridProps {
  grid: GridType;
  isVisualizing: boolean;
  onSetWall: (coord: Coord) => void;
  onSetSourceCoord: (coord: Coord) => void;
  onSetTargetCoord: (coord: Coord) => void;
  onResetVisualization: () => void;
}

const NODE_COLORS = {
  [NodeType.BLANK]: '#ffffff',
  [NodeType.WALL]: '#2d3748',
  [NodeType.SOURCE]: '#48bb78',
  [NodeType.TARGET]: '#ed8936',
  [NodeType.VISITED]: '#bee3f8',
  [NodeType.PATH]: '#fbb6ce',
};

export const CanvasGrid: React.FC<CanvasGridProps> = ({
  grid,
  isVisualizing,
  onSetWall,
  onSetSourceCoord,
  onSetTargetCoord,
  onResetVisualization,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMakingWalls, setIsMakingWalls] = useState(false);
  const [isDragging, setIsDragging] = useState<{
    type: NodeType.SOURCE | NodeType.TARGET;
    coord: Coord;
  } | null>(null);

  const getGridDimensions = () => {
    if (grid.length === 0) return { width: 0, height: 0 };
    return { width: grid[0].length, height: grid.length };
  };

  const coordToCanvasPos = (coord: Coord) => ({
    x: coord.x * CELL_SIZE_PX,
    y: coord.y * CELL_SIZE_PX,
  });

  const canvasPosToCoord = (x: number, y: number): Coord => ({
    x: Math.floor(x / CELL_SIZE_PX),
    y: Math.floor(y / CELL_SIZE_PX),
  });

  const drawCell = (ctx: CanvasRenderingContext2D, coord: Coord, nodeType: NodeType) => {
    const pos = coordToCanvasPos(coord);
    
    // Fill cell
    ctx.fillStyle = NODE_COLORS[nodeType];
    ctx.fillRect(pos.x, pos.y, CELL_SIZE_PX, CELL_SIZE_PX);
    
    // Draw border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(pos.x, pos.y, CELL_SIZE_PX, CELL_SIZE_PX);
  };

  const renderGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getGridDimensions();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all cells
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const node = grid[y][x];
        drawCell(ctx, { x, y }, node.type);
      }
    }
  }, [grid]);

  // Update canvas size and render when grid changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = getGridDimensions();
    canvas.width = width * CELL_SIZE_PX;
    canvas.height = height * CELL_SIZE_PX;
    
    renderGrid();
  }, [grid, renderGrid]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isVisualizing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const coord = canvasPosToCoord(x, y);

    const { width, height } = getGridDimensions();
    if (coord.x < 0 || coord.x >= width || coord.y < 0 || coord.y >= height) return;

    const node = grid[coord.y][coord.x];

    if (node.type === NodeType.SOURCE || node.type === NodeType.TARGET) {
      setIsDragging({ type: node.type, coord });
    } else if (node.type === NodeType.BLANK) {
      setIsMakingWalls(true);
      onSetWall(coord);
    }
  }, [grid, isVisualizing, onSetWall]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isVisualizing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const coord = canvasPosToCoord(x, y);

    const { width, height } = getGridDimensions();
    if (coord.x < 0 || coord.x >= width || coord.y < 0 || coord.y >= height) return;

    if (isMakingWalls) {
      const node = grid[coord.y][coord.x];
      if (node.type === NodeType.BLANK) {
        onSetWall(coord);
      }
    } else if (isDragging) {
      const node = grid[coord.y][coord.x];
      if (node.type === NodeType.BLANK || 
          (node.type === NodeType.SOURCE && isDragging.type === NodeType.TARGET) ||
          (node.type === NodeType.TARGET && isDragging.type === NodeType.SOURCE)) {
        
        if (isDragging.type === NodeType.SOURCE) {
          onSetSourceCoord(coord);
          onResetVisualization();
        } else {
          onSetTargetCoord(coord);
          onResetVisualization();
        }
        setIsDragging({ ...isDragging, coord });
      }
    }
  }, [grid, isVisualizing, isMakingWalls, isDragging, onSetWall, onSetSourceCoord, onSetTargetCoord, onResetVisualization]);

  const handleMouseUp = useCallback(() => {
    setIsMakingWalls(false);
    setIsDragging(null);
  }, []);

  // Global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMakingWalls(false);
      setIsDragging(null);
    };

    if (isMakingWalls || isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isMakingWalls, isDragging]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        display: 'block',
        cursor: isDragging ? 'grabbing' : (isMakingWalls ? 'crosshair' : 'default'),
        border: '1px solid #e2e8f0',
      }}
    />
  );
};