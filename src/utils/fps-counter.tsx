import { useEffect, useRef, useState } from 'react';

export function FPSCounter() {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let running = true;
    function loop() {
      if (!running) return;
      frameCount.current++;
      const now = performance.now();
      if (now - lastTime.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastTime.current = now;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    return () => {
      running = false;
    };
  }, []);

  return (
    <div
      style={{
        fontSize: 12,
        pointerEvents: 'none',
        fontFamily: 'monospace',
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '2px 8px',
        borderRadius: 4,
      }}
    >
      {fps} FPS
    </div>
  );
}
