import { NodeType } from '@/types/enums';
import type { Coord, Grid, Node } from '@/types/types';

// Create an empty grid with SOURCE and TARGET nodes.
export const createEmptyGrid = (
    numCols: number,
    numRows: number,
    sourceCoord: Coord,
    targetCoord: Coord,
): Grid => {
    const grid: Grid = [];
    for (let y = 0; y < numRows; y++) {
        const row: Node[] = [];
        for (let x = 0; x < numCols; x++) {
            const node: Node = { x, y, type: NodeType.BLANK };
            if (x === sourceCoord.x && y === sourceCoord.y) node.type = NodeType.SOURCE;
            else if (x === targetCoord.x && y === targetCoord.y) node.type = NodeType.TARGET;
            row.push(node);
        }
        grid.push(row);
    }
    return grid;
};

// Clone grid but remove VISITED and PATH markings.
export const createGridCopyWithNoPath = (grid: Grid): Grid =>
    grid.map((row) =>
        row.map((node) => {
            if (node.type === NodeType.VISITED || node.type === NodeType.PATH) {
                return { ...node, type: NodeType.BLANK };
            }
            return { ...node };
        }),
    );

// Shallow-clone grid and override a single node.
export const replaceNodeInGrid = (grid: Grid, node: Node): Grid => {
    const cloned = grid.map((r) => [...r]);
    cloned[node.y][node.x] = node;
    return cloned;
}; 