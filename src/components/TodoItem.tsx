"use client";

import { useState } from "react";
import { Trash2, Edit2, Calendar, Check, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Todo } from "@/types";
import { CATEGORIES, PRIORITIES } from "@/constants";
import CategoryIcon from "./CategoryIcon";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onToggleSubtask,
}: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryObj = CATEGORIES.find((c) => c.id === todo.category) || CATEGORIES[CATEGORIES.length - 1];
  const priorityObj = PRIORITIES.find((p) => p.id === todo.priority) || PRIORITIES[0];

  // Calculate subtask progress
  const hasSubtasks = todo.subtasks && todo.subtasks.length > 0;
  const completedSubtasks = hasSubtasks ? todo.subtasks.filter((st) => st.completed).length : 0;
  const subtasksCount = hasSubtasks ? todo.subtasks.length : 0;
  const subtaskProgress = hasSubtasks ? Math.round((completedSubtasks / subtasksCount) * 100) : 0;

  // Check if task is overdue
  const isOverdue = (() => {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  })();

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div
      className="glass-panel hover-scale"
      style={{
        display: "flex",
        flexDirection: "column",
        borderLeft: `5px solid ${categoryObj.color}`,
        overflow: "hidden",
        opacity: todo.completed ? 0.75 : 1,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: "16px",
          alignItems: "center",
          gap: "14px",
          cursor: "pointer",
        }}
        onClick={() => {
          if (todo.description || hasSubtasks) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {/* Custom Circular Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(todo.id);
          }}
          style={{
            background: todo.completed ? "var(--primary)" : "transparent",
            border: todo.completed ? "2px solid var(--primary)" : "2px solid var(--border-color)",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            color: "#ffffff",
            transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {todo.completed && <Check size={14} strokeWidth={3} />}
        </button>

        {/* Task Text & Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
            {/* Category tag */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: categoryObj.color,
              }}
            >
              <CategoryIcon name={categoryObj.icon} size={11} color={categoryObj.color} />
              {categoryObj.name}
            </span>

            {/* Priority Badge */}
            <span
              className="badge"
              style={{
                background: priorityObj.bg,
                color: priorityObj.color,
                padding: "2px 6px",
                fontSize: "0.65rem",
              }}
            >
              {priorityObj.name}
            </span>
          </div>

          <h4
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "var(--text-primary)",
              textDecoration: todo.completed ? "line-through" : "none",
              colorScheme: todo.completed ? "var(--text-muted)" : "var(--text-primary)",
              opacity: todo.completed ? 0.6 : 1,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              fontFamily: "var(--font-sans)",
            }}
          >
            {todo.title}
          </h4>

          {/* Bottom Row Information */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px", flexWrap: "wrap" }}>
            {/* Due date tag */}
            {todo.dueDate && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: isOverdue ? "var(--priority-high)" : "var(--text-secondary)",
                }}
              >
                {isOverdue ? <Clock size={12} /> : <Calendar size={12} />}
                {formatDueDate(todo.dueDate)}
                {isOverdue && " (Overdue)"}
              </span>
            )}

            {/* Subtask count overview */}
            {hasSubtasks && (
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
                {completedSubtasks}/{subtasksCount} subtasks
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(todo)}
            className="hover-scale"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
            }}
            aria-label="Edit Task"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="hover-scale"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--priority-high)",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
            }}
            aria-label="Delete Task"
          >
            <Trash2 size={15} />
          </button>

          {/* Chevron Indicator */}
          {(todo.description || hasSubtasks) && (
            <div style={{ color: "var(--text-muted)", display: "flex", padding: "4px" }}>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Subtask/Description drawer */}
      {isExpanded && (todo.description || hasSubtasks) && (
        <div
          className="anim-fade-in"
          style={{
            padding: "0 16px 16px 16px",
            borderTop: "1px solid var(--border-color)",
            background: "rgba(0, 0, 0, 0.01)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Description */}
          {todo.description && (
            <div style={{ marginTop: "12px" }}>
              <h5 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "4px" }}>
                Description
              </h5>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4", whiteSpace: "pre-wrap" }}>
                {todo.description}
              </p>
            </div>
          )}

          {/* Subtasks checklist */}
          {hasSubtasks && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h5 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Subtasks
                </h5>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--primary)" }}>
                  {subtaskProgress}%
                </span>
              </div>

              {/* Progress Line */}
              <div style={{ width: "100%", height: "4px", background: "var(--border-color)", borderRadius: "2px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${subtaskProgress}%`,
                    height: "100%",
                    background: "var(--primary)",
                    borderRadius: "2px",
                    transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>

              {/* Checkboxes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                {todo.subtasks.map((st) => (
                  <label
                    key={st.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.8rem",
                      color: st.completed ? "var(--text-muted)" : "var(--text-secondary)",
                      cursor: "pointer",
                      padding: "4px 0",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => onToggleSubtask(todo.id, st.id)}
                      style={{
                        width: "14px",
                        height: "14px",
                        accentColor: "var(--primary)",
                        cursor: "pointer",
                      }}
                    />
                    <span style={{ textDecoration: st.completed ? "line-through" : "none" }}>{st.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
