import { NodeType } from '@/types/enums';
import { Coord } from '@/types/types';

export interface AnimationState {
  coord: Coord;
  nodeType: NodeType;
  startTime: number;
  duration: number;
  progress: number;
  isComplete: boolean;
}

export class CanvasAnimationSystem {
  private animations = new Map<string, AnimationState>();
  private animationId: number | null = null;
  private isRunning = false;

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
  }

  addAnimation(coord: Coord, nodeType: NodeType): void {
    const key = `${coord.x}-${coord.y}`;
    const duration = this.getAnimationDuration(nodeType);

    this.animations.set(key, {
      coord,
      nodeType,
      startTime: performance.now(),
      duration,
      progress: 0,
      isComplete: false,
    });

    if (!this.isRunning) {
      this.start();
    }
  }

  removeAnimation(coord: Coord): void {
    const key = `${coord.x}-${coord.y}`;
    this.animations.delete(key);
  }

  clearAllAnimations(): void {
    this.animations.clear();
  }

  private getAnimationDuration(nodeType: NodeType): number {
    switch (nodeType) {
      case NodeType.VISITED:
        return 2000; // 2s
      case NodeType.PATH:
        return 1000; // 1s
      case NodeType.WALL:
        return 250; // 0.25s
      default:
        return 0;
    }
  }

  private animate = (): void => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    let hasActiveAnimations = false;
    const completedAnimations: string[] = [];

    for (const [key, animation] of this.animations.entries()) {
      const elapsed = currentTime - animation.startTime;
      animation.progress = Math.min(elapsed / animation.duration, 1);
      animation.isComplete = animation.progress >= 1;

      if (animation.isComplete) {
        completedAnimations.push(key);
      } else {
        hasActiveAnimations = true;
      }
    }

    // Remove completed animations
    completedAnimations.forEach((key) => {
      this.animations.delete(key);
    });

    if (hasActiveAnimations) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.isRunning = false;
    }
  };

  getActiveAnimations(): AnimationState[] {
    return Array.from(this.animations.values());
  }
}

// Animation easing functions
export const easeOut = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

export const easeIn = (t: number): number => {
  return t * t * t;
};

// Color interpolation utility
export const interpolateColor = (
  color1: [number, number, number],
  color2: [number, number, number],
  t: number,
): [number, number, number] => {
  return [
    Math.round(color1[0] + (color2[0] - color1[0]) * t),
    Math.round(color1[1] + (color2[1] - color1[1]) * t),
    Math.round(color1[2] + (color2[2] - color1[2]) * t),
  ];
};

export const rgbToString = (rgb: [number, number, number]): string => {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

// Animation keyframe definitions matching original CSS
export const getVisitedNodeAnimation = (progress: number) => {
  let scale: number;
  let color: [number, number, number];
  let borderRadius: number;

  const easedProgress = easeOut(progress);

  if (easedProgress <= 0.5) {
    // 0% to 50%: scale from 0.3 to 1.0, color from dark blue to medium blue
    const t = easedProgress * 2; // 0 to 1
    scale = 0.3 + (1.0 - 0.3) * t;
    color = interpolateColor([0, 0, 66], [17, 104, 217], t);
    borderRadius = 100 * (1 - t * 0.5); // Start rounded, become less rounded
  } else if (easedProgress <= 0.75) {
    // 50% to 75%: scale from 1.0 to 1.2, color to green
    const t = (easedProgress - 0.5) * 4; // 0 to 1
    scale = 1.0 + (1.2 - 1.0) * t;
    color = interpolateColor([17, 104, 217], [0, 217, 159], t);
    borderRadius = 50 * (1 - t);
  } else {
    // 75% to 100%: scale from 1.2 to 1.0, color to final blue
    const t = (easedProgress - 0.75) * 4; // 0 to 1
    scale = 1.2 + (1.0 - 1.2) * t;
    color = interpolateColor([0, 217, 159], [0, 190, 218], t);
    borderRadius = 0;
  }

  return { scale, color, borderRadius };
};

export const getPathNodeAnimation = (progress: number) => {
  let scale: number;
  let color: [number, number, number];

  const easedProgress = easeOut(progress);

  if (easedProgress <= 0.5) {
    // 0% to 50%: scale from 0.3 to 1.2
    const t = easedProgress * 2;
    scale = 0.3 + (1.2 - 0.3) * t;
    color = [255, 255, 0]; // Yellow throughout
  } else {
    // 50% to 100%: scale from 1.2 to 1.0
    const t = (easedProgress - 0.5) * 2;
    scale = 1.2 + (1.0 - 1.2) * t;
    color = [255, 255, 0]; // Stay yellow
  }

  return { scale, color, borderRadius: 0 };
};

export const getWallNodeAnimation = (progress: number) => {
  let scale: number;
  const color: [number, number, number] = [12, 53, 71]; // Dark blue throughout

  const easedProgress = easeIn(progress);

  if (easedProgress <= 0.5) {
    // 0% to 50%: scale from 0.3 to 1.2
    const t = easedProgress * 2;
    scale = 0.3 + (1.2 - 0.3) * t;
  } else {
    // 50% to 100%: scale from 1.2 to 1.0
    const t = (easedProgress - 0.5) * 2;
    scale = 1.2 + (1.0 - 1.2) * t;
  }

  return { scale, color, borderRadius: 0 };
};

export const getAnimationProps = (nodeType: NodeType, progress: number) => {
  switch (nodeType) {
    case NodeType.VISITED:
      return getVisitedNodeAnimation(progress);
    case NodeType.PATH:
      return getPathNodeAnimation(progress);
    case NodeType.WALL:
      return getWallNodeAnimation(progress);
    default:
      return { scale: 1, color: [255, 255, 255] as [number, number, number], borderRadius: 0 };
  }
};
