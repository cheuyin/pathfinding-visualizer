import React, { useRef, useEffect, useCallback, useState } from 'react';
import { NodeType } from '@/types/enums';
import { Coord, Grid as GridType } from '@/types/types';
import { CELL_SIZE_PX } from '@/constants';
import { CanvasAnimationSystem, getAnimationProps, rgbToString } from '@/animation/canvas-animations';

interface CanvasGridProps {
  grid: GridType;
  isVisualizing: boolean;
  onSetWall: (coord: Coord) => void;
  onSetSourceCoord: (coord: Coord) => void;
  onSetTargetCoord: (coord: Coord) => void;
  onResetVisualization: () => void;
}

const STATIC_NODE_COLORS = {
  [NodeType.BLANK]: [255, 255, 255] as [number, number, number],
  [NodeType.WALL]: [45, 55, 72] as [number, number, number],
  [NodeType.SOURCE]: [255, 255, 255] as [number, number, number],
  [NodeType.TARGET]: [255, 255, 255] as [number, number, number],
  [NodeType.VISITED]: [0, 190, 218] as [number, number, number], // Final visited color
  [NodeType.PATH]: [255, 255, 0] as [number, number, number], // Yellow for path
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
  const animationSystemRef = useRef(new CanvasAnimationSystem());
  const [isMakingWalls, setIsMakingWalls] = useState(false);
  const [isDragging, setIsDragging] = useState<{
    type: NodeType.SOURCE | NodeType.TARGET;
    coord: Coord;
  } | null>(null);
  const lastGridRef = useRef<GridType>([]);

  const getGridDimensions = useCallback(() => {
    if (grid.length === 0) return { width: 0, height: 0 };
    return { width: grid[0].length, height: grid.length };
  }, [grid]);

  const coordToCanvasPos = (coord: Coord) => ({
    x: coord.x * CELL_SIZE_PX,
    y: coord.y * CELL_SIZE_PX,
  });

  const canvasPosToCoord = (x: number, y: number): Coord => ({
    x: Math.floor(x / CELL_SIZE_PX),
    y: Math.floor(y / CELL_SIZE_PX),
  });

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };
  
  const drawIcon = (ctx: CanvasRenderingContext2D, pos: { x: number; y: number }, nodeType: NodeType) => {
    const centerX = pos.x + CELL_SIZE_PX / 2;
    const centerY = pos.y + CELL_SIZE_PX / 2;
    const size = 16;
    
    ctx.save();
    ctx.lineWidth = 2;
    
    if (nodeType === NodeType.SOURCE) {
      // Draw smiley face
      ctx.strokeStyle = '#1e40af';
      ctx.fillStyle = '#3b82f6';
      
      // Face circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Eyes
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(centerX - 3, centerY - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(centerX + 3, centerY - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Smile
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY + 1, 4, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
    } else if (nodeType === NodeType.TARGET) {
      // Draw target/bullseye
      ctx.strokeStyle = '#d97706';
      ctx.fillStyle = '#f59e0b';
      
      // Outer circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Inner circle
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Center dot
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  const drawCell = useCallback((
    ctx: CanvasRenderingContext2D, 
    coord: Coord, 
    nodeType: NodeType,
    animationProps?: { scale: number; color: [number, number, number]; borderRadius: number }
  ) => {
    const pos = coordToCanvasPos(coord);
    const centerX = pos.x + CELL_SIZE_PX / 2;
    const centerY = pos.y + CELL_SIZE_PX / 2;
    
    ctx.save();
    
    if (animationProps) {
      // Apply scaling transform
      ctx.translate(centerX, centerY);
      ctx.scale(animationProps.scale, animationProps.scale);
      ctx.translate(-CELL_SIZE_PX / 2, -CELL_SIZE_PX / 2);
      
      // Use animated color
      ctx.fillStyle = rgbToString(animationProps.color);
      
      if (animationProps.borderRadius > 0) {
        // Draw rounded rectangle for visited nodes
        const radius = (animationProps.borderRadius / 100) * (CELL_SIZE_PX / 2);
        drawRoundedRect(ctx, 0, 0, CELL_SIZE_PX, CELL_SIZE_PX, radius);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, CELL_SIZE_PX, CELL_SIZE_PX);
      }
    } else {
      // Static color
      const color = STATIC_NODE_COLORS[nodeType];
      ctx.fillStyle = rgbToString(color);
      ctx.fillRect(pos.x, pos.y, CELL_SIZE_PX, CELL_SIZE_PX);
    }
    
    ctx.restore();
    
    // Draw border
    ctx.strokeStyle = '#9ae2ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(pos.x, pos.y, CELL_SIZE_PX, CELL_SIZE_PX);
    
    // Draw icons for source/target
    if (nodeType === NodeType.SOURCE || nodeType === NodeType.TARGET) {
      drawIcon(ctx, pos, nodeType);
    }
  }, []);

  const renderGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = getGridDimensions();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get active animations
    const animations = animationSystemRef.current.getActiveAnimations();
    const animationMap = new Map();
    animations.forEach(anim => {
      const key = `${anim.coord.x}-${anim.coord.y}`;
      animationMap.set(key, anim);
    });
    
    // Draw all cells
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const node = grid[y][x];
        const key = `${x}-${y}`;
        const animation = animationMap.get(key);
        
        let animationProps;
        if (animation && !animation.isComplete) {
          animationProps = getAnimationProps(animation.nodeType, animation.progress);
        }
        
        // Only show animation for nodes that should be animated
        // For completed animations, show the final static color
        if (animation && !animation.isComplete) {
          drawCell(ctx, { x, y }, node.type, animationProps);
        } else {
          drawCell(ctx, { x, y }, node.type);
        }
      }
    }
  }, [grid, getGridDimensions, drawCell]);

  // Detect new animated nodes and trigger animations
  useEffect(() => {
    const currentGrid = grid;
    const lastGrid = lastGridRef.current;
    
    if (lastGrid.length > 0) {
      for (let y = 0; y < currentGrid.length; y++) {
        for (let x = 0; x < currentGrid[y]?.length || 0; x++) {
          const currentNode = currentGrid[y]?.[x];
          const lastNode = lastGrid[y]?.[x];
          
          if (currentNode && lastNode && currentNode.type !== lastNode.type) {
            // Node type changed
            if (currentNode.type === NodeType.VISITED || 
                currentNode.type === NodeType.PATH || 
                currentNode.type === NodeType.WALL) {
              // Add animation for new animated nodes
              animationSystemRef.current.addAnimation(
                { x, y }, 
                currentNode.type
              );
            } else if (lastNode.type === NodeType.VISITED || lastNode.type === NodeType.PATH) {
              // Remove animation if node changed from animated to non-animated
              animationSystemRef.current.removeAnimation({ x, y });
            }
          }
        }
      }
    }
    
    lastGridRef.current = JSON.parse(JSON.stringify(currentGrid));
  }, [grid]);
  
  // Animation loop
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      renderGrid();
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [renderGrid]);

  // Update canvas size when grid changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = getGridDimensions();
    canvas.width = width * CELL_SIZE_PX;
    canvas.height = height * CELL_SIZE_PX;
  }, [grid, getGridDimensions]);

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
  }, [grid, isVisualizing, onSetWall, getGridDimensions]);

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
  }, [grid, isVisualizing, isMakingWalls, isDragging, onSetWall, onSetSourceCoord, onSetTargetCoord, onResetVisualization, getGridDimensions]);

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
  
  // Start animation system
  useEffect(() => {
    const animationSystem = animationSystemRef.current;
    animationSystem.start();
    return () => {
      animationSystem.stop();
    };
  }, []);

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