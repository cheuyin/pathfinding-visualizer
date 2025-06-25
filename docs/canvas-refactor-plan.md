## Canvas 2 D Refactor — “60 FPS Now” Edition

### 0. North Star

**Ship a canvas grid that holds 60 FPS on a 100 × 100 board within one week—no React re-renders during animation.**
Extra eye-candy and engine abstractions wait until fps ≥ 55 on stress-test builds.

---

### 1. Data + Logic

| Step | What                                                                                      | Why                                 |
| ---- | ----------------------------------------------------------------------------------------- | ----------------------------------- |
| 1.1  | **`GridData` = `Uint8Array`** (`0 = empty`, `1 = wall`, `2 = visited`, `3 = path`).       | Zero GC, cache-friendly, tiny.      |
| 1.2  | **Path-solver → Web Worker**; posts a `Uint32Array` index list for “visited” then “path”. | Keeps main thread free for drawing. |
| 1.3  | **Animation state = two ring buffers** of `[index, startTime]` for visited/path.          | No per-cell objects.                |

---

### 2. Rendering

| Step | What                                                                                                                                                                                           | Why                                                        |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 2.1  | Mount **one `<canvas>`** inside your existing `<Grid>` React component.                                                                                                                        | Leaves React for UI chrome only.                           |
| 2.2  | **Hi-DPI safe:** `ResizeObserver` → recalc DPR, `canvas.width/height`, `ctx.scale`.                                                                                                            | Handles window/device zoom.                                |
| 2.3  | **`drawFrame(now)`** (called via `requestAnimationFrame`):<br> • Paint whole grid each frame ( ≤ 10 k `fillRect` @100×100 )<br> • Read colors from `GridData` + easing on active ring buffers. | Simpler than dirty-rects; still well under 1 ms on laptop. |
| 2.4  | **Tiny dev FPS counter** every 60 frames.                                                                                                                                                      | Fail-fast on regressions.                                  |

---

### 3. Input

| Step | What                                                                        | Why                                   |
| ---- | --------------------------------------------------------------------------- | ------------------------------------- |
| 3.1  | **Pointer events → grid coords** via math (`(clientX-rect.left)/cellSize`). | Single path for mouse, touch, stylus. |
| 3.2  | Drag to place walls; drag-drop start/target.                                | Feature parity.                       |

---

### 4. Migration Hooks

| Step | What                                                                                                              | Why                             |
| ---- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 4.1  | **`ReactCanvasAdapter`** — thin wrapper that translates old Redux/Context grid actions into `GridData` mutations. | Lets old controls keep working. |
| 4.2  | Keep old DOM grid behind a feature flag for one sprint.                                                           | Rollback safety.                |

---

### 5. Hard Stop Scope

✅ Draw grid, walls, visited nodes, final path
✅ 60 FPS on 100 × 100 stress test
❌ No glow/ripple/zoom until baseline hit
❌ No custom “animation engine” abstraction until a real requirement emerges

---

### 6. Rough Timeline

| Day | Deliverable                                                  |
| --- | ------------------------------------------------------------ |
| 1   | Typed-array `GridData`, canvas mount, ResizeObserver.        |
| 2   | Basic draw loop hitting 60 FPS on static grid.               |
| 3   | Pointer events for wall toggles; adapter wiring.             |
| 4   | Path-solver offloaded to worker; animate visited & path.     |
| 5   | Refactor, clean-up, FPS validation on 100 × 100 & 200 × 200. |

---

### 7. Future-Proof Escape Hatches

* > 100 × 100 or per-cell alpha ➜ swap draw loop for WebGL instancing.
* Need fancy FX ➜ add optional shader path behind feature flag.
* Heavy canvas math ➜ move draw loop to `OffscreenCanvas` in worker.

---

**Go build.**
