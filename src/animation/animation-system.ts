import { Coord } from '../types/types';

export interface AnimationFrame {
  coord: Coord;
  action: 'MARK_VISITED' | 'MARK_PATH' | 'SET_WALL';
  timestamp: number;
}

export interface AnimationSequence {
  frames: AnimationFrame[];
  onComplete?: () => void;
  onFrameUpdate?: (frame: AnimationFrame) => void;
}

export class AnimationSystem {
  private animationId: number | null = null;
  private isRunning = false;
  private currentSequence: AnimationSequence | null = null;
  private startTime = 0;
  private frameIndex = 0;

  start(sequence: AnimationSequence): void {
    this.stop();
    this.currentSequence = sequence;
    this.frameIndex = 0;
    this.startTime = performance.now();
    this.isRunning = true;
    this.animate();
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
    this.currentSequence = null;
  }

  private animate = (): void => {
    if (!this.isRunning || !this.currentSequence) return;

    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;

    while (
      this.frameIndex < this.currentSequence.frames.length &&
      this.currentSequence.frames[this.frameIndex].timestamp <= elapsed
    ) {
      const frame = this.currentSequence.frames[this.frameIndex];
      this.currentSequence.onFrameUpdate?.(frame);
      this.frameIndex++;
    }

    if (this.frameIndex >= this.currentSequence.frames.length) {
      this.isRunning = false;
      this.currentSequence.onComplete?.();
      return;
    }

    this.animationId = requestAnimationFrame(this.animate);
  };
}

export const createVisitedNodesSequence = (
  coords: Coord[],
  delayMs: number,
  onFrameUpdate: (frame: AnimationFrame) => void,
  onComplete?: () => void,
): AnimationSequence => {
  const frames: AnimationFrame[] = coords.map((coord, index) => ({
    coord,
    action: 'MARK_VISITED' as const,
    timestamp: index * delayMs,
  }));

  return {
    frames,
    onFrameUpdate,
    onComplete,
  };
};

export const createPathSequence = (
  coords: Coord[],
  delayMs: number,
  onFrameUpdate: (frame: AnimationFrame) => void,
  onComplete?: () => void,
): AnimationSequence => {
  const frames: AnimationFrame[] = coords.map((coord, index) => ({
    coord,
    action: 'MARK_PATH' as const,
    timestamp: index * delayMs,
  }));

  return {
    frames,
    onFrameUpdate,
    onComplete,
  };
};

export const createMazeSequence = (
  coords: Coord[],
  delayMs: number,
  onFrameUpdate: (frame: AnimationFrame) => void,
  onComplete?: () => void,
): AnimationSequence => {
  const frames: AnimationFrame[] = coords.map((coord, index) => ({
    coord,
    action: 'SET_WALL' as const,
    timestamp: index * delayMs,
  }));

  return {
    frames,
    onFrameUpdate,
    onComplete,
  };
};

export const createCombinedSequence = (
  visitedNodes: Coord[],
  pathNodes: Coord[],
  visitedDelayMs: number,
  pathDelayMs: number,
  onFrameUpdate: (frame: AnimationFrame) => void,
  onComplete?: () => void,
): AnimationSequence => {
  const visitedFrames: AnimationFrame[] = visitedNodes.map((coord, index) => ({
    coord,
    action: 'MARK_VISITED' as const,
    timestamp: index * visitedDelayMs,
  }));

  const visitedDuration = visitedNodes.length * visitedDelayMs;
  const pathFrames: AnimationFrame[] = pathNodes.map((coord, index) => ({
    coord,
    action: 'MARK_PATH' as const,
    timestamp: visitedDuration + index * pathDelayMs,
  }));

  return {
    frames: [...visitedFrames, ...pathFrames],
    onFrameUpdate,
    onComplete,
  };
};