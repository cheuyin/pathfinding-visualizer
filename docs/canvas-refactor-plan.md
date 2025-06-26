Based on my analysis, here's a focused plan to migrate from React state-based animation to HTML Canvas for 60 FPS performance:

Current Bottlenecks

- 7 FPS due to massive React re-renders (thousands of <td> elements)
- setTimeout-based sequential animation with 2ms delays
- DOM-heavy HTML table structure
- Immutable state updates creating object reference churn

Core Migration Strategy

Phase 1: Data Structure Transformation
1. Replace Node[][] with Uint8Array - 8x memory reduction, cache-friendly
2. Convert node types to numeric constants - Enable bitwise operations
3. Maintain coordinate-based API - Minimal disruption to algorithms

Phase 2: Canvas Rendering System
4. Single <canvas> element replaces HTML table
5. Direct pixel manipulation for 25×25px cells
6. requestAnimationFrame animation loop - 60 FPS target
7. Batch rendering updates - Paint all changes per frame

Phase 3: Event System
8. Canvas pointer event handling - Convert mouse coords to grid coords
9. Preserve drag-and-drop behavior - Source/target positioning
10. Wall creation with mouse drag - Maintain current UX

Key Technical Changes

Data Structure:
// From: Node[][] (objects with {x, y, type})
// To: Uint8Array (flat array with enum values)

Animation System:
// From: setTimeout sequences (2ms delays)
// To: requestAnimationFrame with frame-based updates

Rendering:
// From: React re-renders of 1000+ components
// To: Canvas.fillRect() calls in single frame

Preserved Elements

- All pathfinding algorithms (with data adapter)
- Current state management in use-visualizer.ts
- Grid sizing and window responsiveness
- UI controls and algorithm selection

Expected Performance

- 60 FPS animation (vs current 7 FPS)
- 8x less memory usage via Uint8Array
- Elimination of React render overhead
- Smoother user interactions

The migration maintains current functionality while achieving your 60 FPS target through focused Canvas rendering without React re-render bottlenecks.