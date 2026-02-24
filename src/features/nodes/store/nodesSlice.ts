import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Habit } from '@features/habits/types/habit.types';

export interface NodesState {
  items: Habit[];
  loading: boolean;
}

const initialState: NodesState = {
  items: [],
  loading: false,
};

export { initialState };

const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Habit[]>) => {
      state.items = action.payload;
    },
    addNode: (state, action: PayloadAction<Habit>) => {
      state.items.push(action.payload);
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((node) => node.id !== action.payload);
    },
    updateNode: (state, action: PayloadAction<Habit>) => {
      const index = state.items.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    sendPulse: () => {
      // Note: pulse counting would be handled in a separate pulse tracking slice
      // This is just a placeholder for the nodes slice
    },
  },
});

export const { setNodes, addNode, removeNode, updateNode, sendPulse } = nodesSlice.actions;

// Селекторы
export const selectNodes = (state: { nodes: NodesState }) => state.nodes.items;

export const selectActiveNodes = (state: { nodes: NodesState }) =>
  state.nodes.items.filter((node) => node.status === 'active');

export const selectPausedNodes = (state: { nodes: NodesState }) =>
  state.nodes.items.filter((node) => node.status === 'paused');

export const selectNodeById = (state: { nodes: NodesState }, nodeId: string) =>
  state.nodes.items.find((node) => node.id === nodeId);

export default nodesSlice.reducer;
