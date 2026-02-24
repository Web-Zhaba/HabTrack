# 📜 NODES Philosophy & Guidelines

## 1. Core Philosophy

**NODES** is not a habit tracker — it's a **life pattern visualizer**. Users don't check boxes; they build an interactive neural network of their personality.

### Key Metaphors

| Term | Definition | Old Term |
|------|------------|----------|
| **Node (Узел)** | An atom of activity — a daily ritual that becomes part of your identity | Habit |
| **Connector (Коннектор)** | A semantic link (tag) that connects nodes into clusters | Tag |
| **Pulse (Импульс)** | The act of completing an action — sends energy to the node | Mark Complete |
| **Stability (Стабильность)** | A metric of node viability (0-100%) — how alive is this node? | Streak |
| **Network (Сеть)** | The final progress map + social environment | N/A |

### Design Principles

1. **Life is a network, not a list** — Nodes connect through shared connectors
2. **Energy flows through pulses** — Each completion strengthens the node
3. **Neglect kills nodes** — Unused nodes become dim and lose connections
4. **Visual feedback is crucial** — Users should *feel* their network growing

---

## 2. Terminology Guidelines

### ✅ Use These Terms

| Context | Correct | Incorrect |
|---------|---------|-----------|
| Feature name | `features/nodes` | `features/habits` |
| Component | `NodeCard` | `HabitCard` |
| Action | `sendPulse()` | `markComplete()` |
| Metric | `stability` | `streak` |
| Creation | `createNode()` | `createHabit()` |
| UI Label | "Initialize Node" | "Add Habit" |

### Dual Naming (During Transition)

During the transition period, use dual naming in UI:

```typescript
// Good
"Initialize New Node (Habit)"
"Node Stability: 85%"

// Avoid
"Add New Habit"
"Streak: 10 days"
```

### Micro-copy Examples

```typescript
// Form placeholder
placeholder="What habit will become your next node?"

// Tooltip
"Nodes are your daily rituals. Tags act as neural links between them."

// Empty state
"No nodes yet. Initialize your first node to begin building your network."

// FAQ
"Why Nodes, not lists?
Ordinary trackers are just checklists. But life is more complex.
Reading connects to learning, running connects to health and mood.
We call them Nodes because they're intersection points of your interests."
```

---

## 3. Technical Architecture

### Folder Structure

```
src/
├── features/
│   ├── nodes/           # Core node functionality
│   │   ├── components/  # NodeCard, CreateNodeForm, etc.
│   │   ├── store/       # nodesSlice.ts
│   │   ├── hooks/       # useNodeActions, useNodeStability
│   │   ├── lib/         # calculateStability, transformToGraph
│   │   └── types/       # node.types.ts
│   ├── network/         # Graph visualization
│   │   ├── components/  # NetworkGraph, GraphNode
│   │   └── lib/         # physics.ts, graphTransformers.ts
│   ├── connectors/      # Tag/connector management
│   └── onboarding/      # Tutorial, tooltips
```

### Data Model

```typescript
interface Node {
  id: string;           // UUID
  label: string;        // Name (e.g., "Coding")
  connectors: string[]; // Tags (e.g., ["career", "focus"])
  pulseCount: number;   // Total completions
  isCompletedToday: boolean;
  lastPulse: string;    // ISO date of last completion
  stability: number;    // 0-100%
  createdAt: string;    // ISO date
}
```

### State Management

- **Redux Toolkit** with normalized state structure
- **Access by ID** for O(1) lookups (graph performance)
- **Selectors** transform data for different views (list vs graph)

---

## 4. Visual Style: Cyber-Minimalism

### Color Palette

```css
/* Core colors */
--neon-cyan: #00f5ff;
--neon-purple: #b983ff;
--neon-pink: #ff6b9d;

/* Node states */
--node-active: #00f5ff;      /* Cyan glow */
--node-stable: #00ff88;      /* Green glow */
--node-decaying: #ffaa00;    /* Orange glow */
--node-dead: #444444;        /* Dim gray */
```

### Effects

1. **Glow Effect** — Active nodes pulse with outer glow
   ```css
   box-shadow: 0 0 15px var(--neon-cyan);
   ```

2. **Pulse Animation** — On completion, button and node "detonate" with wave
   ```css
   @keyframes pulse-wave {
     0% { transform: scale(1); opacity: 1; }
     100% { transform: scale(1.5); opacity: 0; }
   }
   ```

3. **Decay Animation** — Unused nodes slowly dim
   ```css
   transition: opacity 2s ease-out;
   ```

### Component Guidelines

```typescript
// NodeCard should:
// - Show stability as percentage + visual indicator
// - Glow when recently pulsed
// - Dim when stability < 30%
// - Show connectors as colored badges

// PulseButton should:
// - Trigger wave animation on click
// - Show cooldown state
// - Display pulse count
```

---

## 5. UX Strategy

### Progressive Disclosure

1. **Start simple** — Show list view by default
2. **Unlock graph** — "Advanced View" becomes available after 5+ nodes
3. **Social later** — Network features in Phase 3+

### Onboarding Flow

```
Slide 1: "A habit is not just a checklist item. It's a Node in your life's network."
Slide 2: "Each time you complete an action, you send a Pulse, strengthening this node."
Slide 3: "Shared connectors create links. Your rituals become a living system."
```

### Stability Mechanics

```typescript
// Stability calculation
function calculateStability(node: Node): number {
  const daysSinceLastPulse = daysBetween(node.lastPulse, new Date());
  
  if (daysSinceLastPulse > 30) return 0;      // Dead node
  if (daysSinceLastPulse > 7) return 25;      // Decaying
  if (daysSinceLastPulse > 3) return 60;      // Warning
  return 100 - (daysSinceLastPulse * 5);      // Healthy
}
```

---

## 6. Development Phases

### Phase 0: Foundation (Current)
- [x] Document philosophy
- [ ] Rename `habits` → `nodes`
- [ ] Migrate data structures
- [ ] Update all imports

### Phase 1: Stability Metric
- [ ] Implement `calculateStability()`
- [ ] Update `NodeCard` with stability display
- [ ] Add decay animations

### Phase 2: Cyber-Minimalism UI
- [ ] Create neon theme
- [ ] Add glow effects
- [ ] Implement pulse animations

### Phase 3: Network Graph
- [ ] Install `react-force-graph`
- [ ] Create `NetworkGraph` component
- [ ] Implement connector-based physics

### Phase 4: Onboarding
- [ ] Create tutorial modal
- [ ] Add tooltips everywhere
- [ ] Write FAQ page

---

## 7. Code Review Checklist

Before merging any NODES-related code:

- [ ] Uses correct terminology (Node, Pulse, Stability, Connector)
- [ ] No references to "habit", "streak", "mark complete"
- [ ] Visual feedback for user actions
- [ ] Stability is displayed correctly
- [ ] Animations are smooth (60fps)
- [ ] Works in both list and graph view (when implemented)

---

## 8. Migration Notes

### Data Migration

```typescript
// Old Habit → New Node
{
  id: "habit-123",           // → keep as-is
  name: "Reading",           // → label: "Reading"
  tags: ["learning"],        // → connectors: ["learning"]
  streak: 10,                // → calculate stability from lastPulse
  completedToday: true,      // → isCompletedToday: true
  lastCompleted: "2026-02-24" // → lastPulse: "2026-02-24T00:00:00Z"
}
```

### localStorage Keys

| Old Key | New Key |
|---------|---------|
| `habtrack-habits` | `habtrack-nodes` |
| `habtrack-logs` | `habtrack-pulses` |

---

## 9. Quick Reference

### Common Patterns

```typescript
// Creating a node
const handleCreateNode = (data: CreateNodeFormData) => {
  dispatch(createNode({
    label: data.label,
    connectors: data.connectors,
    stability: 100,
    lastPulse: null,
  }));
};

// Sending a pulse
const handleSendPulse = (nodeId: string) => {
  dispatch(sendPulse(nodeId));
  // Triggers stability recalculation
};

// Calculating stability
const stability = useAppSelector(state => 
  selectNodeStability(state, nodeId)
);
```

### Do's and Don'ts

| Do | Don't |
|----|-------|
| "Initialize Node" | "Add Habit" |
| "Send Pulse" | "Mark Complete" |
| "Node Stability: 85%" | "Streak: 10 days" |
| "Connector" | "Tag" |
| "Network View" | "Graph" |

---

**Last Updated:** 2026-02-24  
**Version:** 1.0  
**Status:** Active
