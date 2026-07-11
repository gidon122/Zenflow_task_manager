"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, X, Calendar, Flag, Tag, CheckSquare, ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORIES, PRIORITIES } from "@/constants";
import { Priority, Todo, SubTask } from "@/types";
import CategoryIcon from "./CategoryIcon";

interface TodoFormProps {
  onAdd: (todo: {
    title: string;
    description: string;
    priority: Priority;
    category: string;
    dueDate?: string;
    subtasks: SubTask[];
  }) => void;
  editingTodo?: Todo | null;
  onUpdate?: (todo: Todo) => void;
  onCancelEdit?: () => void;
}

export default function TodoForm({ onAdd, editingTodo, onUpdate, onCancelEdit }: TodoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState("work");
  const [dueDate, setDueDate] = useState("");
  
  // Subtasks building
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || "");
      setPriority(editingTodo.priority);
      setCategory(editingTodo.category);
      setDueDate(editingTodo.dueDate || "");
      setSubtasks(editingTodo.subtasks);
      setIsOpen(true);
    } else {
      resetForm();
    }
  }, [editingTodo]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("work");
    setDueDate("");
    setSubtasks([]);
    setNewSubtaskTitle("");
    if (!editingTodo) setIsOpen(false);
  };

  const handleAddSubtask = (e: React.MouseEvent | React.KeyboardEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, { id: crypto.randomUUID(), title: newSubtaskTitle.trim(), completed: false }]);
    setNewSubtaskTitle("");
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTodo && onUpdate) {
      onUpdate({
        ...editingTodo,
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        dueDate: dueDate || undefined,
        subtasks,
      });
      if (onCancelEdit) onCancelEdit();
    } else {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        dueDate: dueDate || undefined,
        subtasks,
      });
    }
    resetForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel anim-slide-up"
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        overflow: "hidden",
        border: editingTodo ? "1px solid var(--primary)" : "1px solid var(--border-color)",
        boxShadow: editingTodo ? "0 0 15px rgba(99, 102, 241, 0.15)" : "var(--shadow-md)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          {editingTodo ? "Edit Task" : "Create New Task"}
        </h3>
        {!editingTodo && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "var(--primary)",
              fontSize: "0.85rem",
              fontWeight: 600
            }}
          >
            {isOpen ? (
              <>Collapse <ChevronUp size={16} /></>
            ) : (
              <>Expand Form <ChevronDown size={16} /></>
            )}
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Title Input */}
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-base"
          style={{ width: "100%", fontSize: "1rem", fontWeight: 500 }}
          required
          onFocus={() => { if (!editingTodo) setIsOpen(true); }}
        />

        {/* Expandable Section */}
        {(isOpen || editingTodo) && (
          <div
            className="anim-fade-in"
            style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "4px" }}
          >
            {/* Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>Description</label>
              <textarea
                placeholder="Add some details or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-base"
                style={{ width: "100%", height: "80px", resize: "none", fontSize: "0.9rem" }}
              />
            </div>

            {/* Category & Priority in one grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Category Selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Tag size={14} /> Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-base"
                  style={{ width: "100%", cursor: "pointer", background: "var(--bg-base)" }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Flag size={14} /> Priority
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {PRIORITIES.map((p) => {
                    const isSelected = priority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id as Priority)}
                        style={{
                          background: isSelected ? p.bg : "var(--bg-base)",
                          color: isSelected ? p.color : "var(--text-secondary)",
                          border: isSelected ? `1px solid ${p.color}` : "1px solid var(--border-color)",
                          padding: "8px",
                          borderRadius: "10px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Due Date & Subtasks adding grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Due Date */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={14} /> Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input-base"
                  style={{ width: "100%", background: "var(--bg-base)" }}
                />
              </div>

              {/* Subtasks Builder */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckSquare size={14} /> Subtasks ({subtasks.length})
                </label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    placeholder="Add subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubtask(e);
                      }
                    }}
                    className="input-base"
                    style={{ flex: 1, padding: "8px 12px", fontSize: "0.85rem" }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="hover-scale"
                    style={{
                      background: "rgba(99, 102, 241, 0.1)",
                      color: "var(--primary)",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Subtask list preview */}
                {subtasks.length > 0 && (
                  <div style={{
                    maxHeight: "80px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    marginTop: "6px",
                    padding: "6px",
                    background: "var(--bg-base)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)"
                  }}>
                    {subtasks.map((st, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.75rem",
                          padding: "2px 6px"
                        }}
                      >
                        <span style={{
                          color: "var(--text-primary)",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          maxWidth: "120px"
                        }}>
                          • {st.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(index)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--priority-high)",
                            padding: 0
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
              {editingTodo && onCancelEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onCancelEdit();
                    resetForm();
                  }}
                  className="hover-scale"
                  style={{
                    background: "transparent",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="hover-lift"
                style={{
                  background: "var(--primary)",
                  color: "#ffffff",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
                }}
              >
                {editingTodo ? "Update Task" : "Add Task"}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
