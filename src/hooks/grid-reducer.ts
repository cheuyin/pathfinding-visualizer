import { NodeType } from '../types/enums';
import type { Coord, Grid, Node } from '../types/types';
import { replaceNodeInGrid } from './grid-utils';

export type GridAction =
    | { type: 'SET_WALL'; coord: Coord }
    | { type: 'SET_SOURCE'; coord: Coord }
    | { type: 'SET_TARGET'; coord: Coord }
    | { type: 'MARK_VISITED'; coord: Coord }
    | { type: 'MARK_PATH'; coord: Coord }
    | { type: 'RESET'; grid: Grid }
    | { type: 'CLEAR_VISUALIZATION' };

export const gridReducer = (state: Grid, action: GridAction): Grid => {
    switch (action.type) {
        case 'SET_WALL': {
            const node = { ...state[action.coord.y][action.coord.x] } as Node;
            if (node.type !== NodeType.BLANK) return state;
            node.type = NodeType.WALL;
            return replaceNodeInGrid(state, node);
        }
        case 'SET_SOURCE': {
            return state.map((row) =>
                row.map((n) => {
                    if (n.x === action.coord.x && n.y === action.coord.y) return { ...n, type: NodeType.SOURCE };
                    if (n.type === NodeType.SOURCE) return { ...n, type: NodeType.BLANK };
                    return n;
                }),
            );
        }
        case 'SET_TARGET': {
            return state.map((row) =>
                row.map((n) => {
                    if (n.x === action.coord.x && n.y === action.coord.y) return { ...n, type: NodeType.TARGET };
                    if (n.type === NodeType.TARGET) return { ...n, type: NodeType.BLANK };
                    return n;
                }),
            );
        }
        case 'MARK_VISITED': {
            const n = state[action.coord.y][action.coord.x];
            if (n.type === NodeType.SOURCE || n.type === NodeType.TARGET) return state;
            return replaceNodeInGrid(state, { ...n, type: NodeType.VISITED });
        }
        case 'MARK_PATH': {
            const n = state[action.coord.y][action.coord.x];
            if (n.type === NodeType.SOURCE || n.type === NodeType.TARGET) return state;
            return replaceNodeInGrid(state, { ...n, type: NodeType.PATH });
        }
        case 'CLEAR_VISUALIZATION': {
            return state.map((row) =>
                row.map((n) =>
                    n.type === NodeType.VISITED || n.type === NodeType.PATH ? { ...n, type: NodeType.BLANK } : n,
                ),
            );
        }
        case 'RESET':
            return action.grid;
        default:
            return state;
    }
}; 