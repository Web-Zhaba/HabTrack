/**
 * Единая точка экспорта для store узлов (Nodes)
 *
 * Использование:
 * import { selectNodes, addNode } from '@features/nodes/store';
 */

export {
  // Actions
  setNodes,
  addNode,
  removeNode,
  updateNode,
  sendPulse,
  // Aliases для обратной совместимости (habits → nodes)
  setNodes as setHabits,
  addNode as addHabit,
  removeNode as removeHabit,
  updateNode as updateHabit,
  // Reducer
  default as nodesReducer,
  // State type
  type NodesState,
  // Initial state
  initialState,
} from './nodesSlice';

export {
  // Selectors
  selectNodes,
  selectActiveNodes,
  selectPausedNodes,
  selectNodeById,
  // Aliases для обратной совместимости
  selectNodes as selectHabits,
  selectActiveNodes as selectActiveHabits,
  selectPausedNodes as selectPausedHabits,
  selectNodeById as selectHabitById,
} from './nodesSlice';

export {
  // Types
  type Node,
  type NodeType,
  type NodeIconName,
  // Aliases для обратной совместимости
  type Node as Habit,
  type NodeType as HabitType,
  type NodeIconName as HabitIconName,
} from '../types/node.types';

export {
  // Utils
  getTodayKey,
  canMarkDate,
} from '@features/habits/lib/utils';
