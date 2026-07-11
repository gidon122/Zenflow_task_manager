"use client";

import { useState, useEffect } from "react";
import { Search, ArrowUpDown, CheckCircle, ListTodo } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import TodoForm from "@/components/TodoForm";
import TodoItem from "@/components/TodoItem";
import ThemeToggle from "@/components/ThemeToggle";
import Confetti from "@/components/Confetti";
import { Todo, Priority, SubTask } from "@/types";

const INITIAL_TODOS: Todo[] = [
  {
    id: "1",
    title: "Design ZenFlow dashboard wireframes",
    description: "Create premium glassmorphic layouts and dark-mode color palettes in Figma for the task runner app.",
    completed: true,
    priority: "high",
    category: "work",
    dueDate: new Date().toISOString().split("T")[0],
    subtasks: [
      { id: "1-1", title: "Establish HSL color palette", completed: true },
      { id: "1-2", title: "Create custom SVG checkboxes", completed: true },
      { id: "1-3", title: "Draft mobile layout grid", completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    title: "Implement TypeScript models and state hooks",
    description: "Write TypeScript schemas, interfaces, and state-management controllers to synchronize tasks with local storage.",
    completed: false,
    priority: "high",
    category: "work",
    dueDate: new Date().toISOString().split("T")[0],
    subtasks: [
      { id: "2-1", title: "Create types/index.ts models", completed: true },
      { id: "2-2", title: "Setup localStorage synchronizer", completed: false },
      { id: "2-3", title: "Add custom confetti trigger on completion", completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Morning cardio & flexibility session",
    description: "30 minutes zone-2 run followed by full-body static stretches to stay fresh and focused.",
    completed: false,
    priority: "medium",
    category: "health",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Read Chapter 4 of 'Clean Code'",
    description: "Focus on meaningful naming, formatting rules, and formatting code blocks.",
    completed: false,
    priority: "low",
    category: "learning",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    subtasks: [
      { id: "4-1", title: "Highlight key takeaways on docstrings", completed: false }
    ],
    createdAt: new Date().toISOString(),
  }
];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dueDateAsc");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [greeting, setGreeting] = useState("Hello");

  // Format greeting based on time of day
  useEffect(() => {
    setIsMounted(true);
    const hr = new Date().getHours();
    if (hr < 12) setGreeting("Good morning");
    else if (hr < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zenflow_todos");
      if (saved) {
        try {
          setTodos(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse todos from localStorage", e);
          setTodos(INITIAL_TODOS);
        }
      } else {
        setTodos(INITIAL_TODOS);
      }
    }
  }, []);

  // Save to LocalStorage
  const saveTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    localStorage.setItem("zenflow_todos", JSON.stringify(newTodos));
  };

  // Add Task
  const handleAddTodo = (todoData: {
    title: string;
    description: string;
    priority: Priority;
    category: string;
    dueDate?: string;
    subtasks: SubTask[];
  }) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: todoData.title,
      description: todoData.description || undefined,
      priority: todoData.priority,
      category: todoData.category,
      dueDate: todoData.dueDate || undefined,
      completed: false,
      subtasks: todoData.subtasks,
      createdAt: new Date().toISOString(),
    };

    saveTodos([newTodo, ...todos]);
  };

  // Toggle Task Completion
  const handleToggleTodo = (id: string) => {
    const updatedTodos = todos.map((t) => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        // If the task itself is marked completed, mark all its subtasks completed too
        const nextSubtasks = t.subtasks.map((st) => ({
          ...st,
          completed: nextCompleted,
        }));
        return { ...t, completed: nextCompleted, subtasks: nextSubtasks };
      }
      return t;
    });

    saveTodos(updatedTodos);

    // Trigger confetti if all tasks are now completed
    const oldComplete = todos.filter((t) => t.completed).length;
    const newComplete = updatedTodos.filter((t) => t.completed).length;
    
    if (newComplete > oldComplete && newComplete === updatedTodos.length && updatedTodos.length > 0) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 4000);
    }
  };

  // Toggle Subtask
  const handleToggleSubtask = (todoId: string, subtaskId: string) => {
    const updatedTodos = todos.map((t) => {
      if (t.id === todoId) {
        const nextSubtasks = t.subtasks.map((st) => {
          if (st.id === subtaskId) return { ...st, completed: !st.completed };
          return st;
        });
        
        // Auto-complete main task if all subtasks are completed (and task had subtasks)
        const allCompleted = nextSubtasks.length > 0 && nextSubtasks.every((st) => st.completed);
        
        return {
          ...t,
          subtasks: nextSubtasks,
          // Only auto-complete if transitioning to all done
          completed: allCompleted ? true : t.completed,
        };
      }
      return t;
    });

    saveTodos(updatedTodos);

    const oldComplete = todos.filter((t) => t.completed).length;
    const newComplete = updatedTodos.filter((t) => t.completed).length;

    if (newComplete > oldComplete && newComplete === updatedTodos.length && updatedTodos.length > 0) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 4000);
    }
  };

  // Delete Task
  const handleDeleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    saveTodos(updated);
    if (editingTodo?.id === id) {
      setEditingTodo(null);
    }
  };

  // Update Task
  const handleUpdateTodo = (updatedTodo: Todo) => {
    const updated = todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t));
    saveTodos(updated);
    setEditingTodo(null);
  };

  // Filters calculation
  const getTodayDateString = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  const filteredTodos = todos.filter((todo) => {
    // 1. Search filter
    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Sidebar Quick Filter / Category filter
    const todayStr = getTodayDateString();
    switch (selectedFilter) {
      case "all":
        return true;
      case "today":
        return todo.dueDate === todayStr && !todo.completed;
      case "upcoming":
        return todo.dueDate && todo.dueDate > todayStr && !todo.completed;
      case "overdue":
        return todo.dueDate && todo.dueDate < todayStr && !todo.completed;
      case "completed":
        return todo.completed;
      default:
        // Assume category filtering
        return todo.category === selectedFilter;
    }
  });

  // Sort calculations
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "dueDateAsc") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === "dueDateDesc") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return b.dueDate.localeCompare(a.dueDate);
    }
    if (sortBy === "priorityHigh") {
      const weight = { high: 3, medium: 2, low: 1 };
      return weight[b.priority] - weight[a.priority];
    }
    if (sortBy === "priorityLow") {
      const weight = { high: 3, medium: 2, low: 1 };
      return weight[a.priority] - weight[b.priority];
    }
    if (sortBy === "createdNew") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "createdOld") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Overview Stats
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const highPriorityCount = todos.filter((t) => t.priority === "high" && !t.completed).length;
  
  const overdueCount = todos.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    return t.dueDate < getTodayDateString();
  }).length;

  if (!isMounted) {
    return null; // Prevents hydration flicker
  }

  return (
    <div className="app-container">
      {/* Background orbs */}
      <div className="ambient-glow">
        <div className="glow-orb-1" />
        <div className="glow-orb-2" />
      </div>

      <Confetti active={confettiActive} />

      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            background: "linear-gradient(135deg, var(--primary) 0%, #ec4899 100%)",
            color: "#ffffff",
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-glow)"
          }}>
            <ListTodo size={24} />
          </div>
          <div>
            <h1 style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              background: "linear-gradient(90deg, var(--primary), #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              ZenFlow
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {greeting}, ready to get things done?
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemeToggle />
        </div>
      </header>

      {/* Core Grid */}
      <div className="app-grid">
        {/* Left Column (Sidebar / Analytics) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <StatsCard
            completedCount={completedCount}
            totalCount={totalCount}
            highPriorityCount={highPriorityCount}
            overdueCount={overdueCount}
          />
          <Sidebar
            todos={todos}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
          />
        </div>

        {/* Right Column (Tasks) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <TodoForm
            onAdd={handleAddTodo}
            editingTodo={editingTodo}
            onUpdate={handleUpdateTodo}
            onCancelEdit={() => setEditingTodo(null)}
          />

          {/* Search, Sort, Filter Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="search-sort-bar">
              {/* Search input wrapper */}
              <div className="search-input-wrapper">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-base"
                />
              </div>

              {/* Sort Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-surface-glass)", backdropFilter: "blur(8px)", border: "1px solid var(--border-color)", padding: "2px 10px", borderRadius: "12px" }}>
                <ArrowUpDown size={15} style={{ color: "var(--text-secondary)" }} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    outline: "none",
                    padding: "8px 4px",
                    color: "var(--text-secondary)"
                  }}
                >
                  <option value="dueDateAsc">Due Date (Soonest)</option>
                  <option value="dueDateDesc">Due Date (Latest)</option>
                  <option value="priorityHigh">Priority (High to Low)</option>
                  <option value="priorityLow">Priority (Low to High)</option>
                  <option value="createdNew">Date Added (Newest)</option>
                  <option value="createdOld">Date Added (Oldest)</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Todo Items list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {sortedTodos.length > 0 ? (
                sortedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onEdit={setEditingTodo}
                    onToggleSubtask={handleToggleSubtask}
                  />
                ))
              ) : (
                <div
                  className="glass-panel"
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <CheckCircle size={36} style={{ color: "var(--border-color)", strokeWidth: 1.5 }} />
                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                      All clear!
                    </h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      No tasks found for this filter or query.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
