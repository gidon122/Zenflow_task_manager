"use client";

import { ClipboardList, Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Todo } from "@/types";
import { CATEGORIES } from "@/constants";
import CategoryIcon from "./CategoryIcon";

interface SidebarProps {
  todos: Todo[];
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

export default function Sidebar({ todos, selectedFilter, onSelectFilter }: SidebarProps) {
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  
  const getTodayDateString = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  const todayCount = todos.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    return t.dueDate === getTodayDateString();
  }).length;

  const upcomingCount = todos.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    return t.dueDate > getTodayDateString();
  }).length;

  const overdueCount = todos.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    return t.dueDate < getTodayDateString();
  }).length;

  const getCategoryCount = (catId: string) => {
    return todos.filter((t) => t.category === catId && !t.completed).length;
  };

  const menuItems = [
    { id: "all", name: "All Tasks", icon: ClipboardList, count: totalCount, color: "var(--primary)" },
    { id: "today", name: "Due Today", icon: Calendar, count: todayCount, color: "var(--priority-medium)" },
    { id: "upcoming", name: "Upcoming", icon: Clock, count: upcomingCount, color: "var(--cat-personal)" },
    { id: "overdue", name: "Overdue", icon: AlertCircle, count: overdueCount, color: "var(--priority-high)" },
    { id: "completed", name: "Completed", icon: CheckCircle2, count: completedCount, color: "var(--priority-low)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Quick Filters */}
      <div className="glass-panel" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <h3 style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "var(--text-muted)",
          paddingLeft: "8px",
          marginBottom: "8px",
          letterSpacing: "0.05em"
        }}>
          Filters
        </h3>
        {menuItems.map((item) => {
          const isSelected = selectedFilter === item.id;
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectFilter(item.id)}
              className="hover-scale"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "none",
                background: isSelected ? "var(--bg-base)" : "transparent",
                borderLeft: isSelected ? `3px solid ${item.color}` : "3px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: isSelected ? 600 : 500,
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <IconComponent size={18} style={{ color: item.color }} />
                <span>{item.name}</span>
              </div>
              <span style={{
                background: isSelected ? "var(--primary)" : "var(--border-color)",
                color: isSelected ? "#ffffff" : "var(--text-secondary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "20px",
                transition: "all 0.2s ease"
              }}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Categories Panel */}
      <div className="glass-panel" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <h3 style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "var(--text-muted)",
          paddingLeft: "8px",
          marginBottom: "8px",
          letterSpacing: "0.05em"
        }}>
          Categories
        </h3>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedFilter === cat.id;
          const activeCount = getCategoryCount(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => onSelectFilter(cat.id)}
              className="hover-scale"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "none",
                background: isSelected ? "var(--bg-base)" : "transparent",
                borderLeft: isSelected ? `3px solid ${cat.color}` : "3px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: isSelected ? 600 : 500,
                fontSize: "0.9rem",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CategoryIcon name={cat.icon} size={16} color={cat.color} />
                <span>{cat.name}</span>
              </div>
              {activeCount > 0 && (
                <span style={{
                  background: isSelected ? "var(--primary)" : "rgba(99, 102, 241, 0.08)",
                  color: isSelected ? "#ffffff" : cat.color,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "20px",
                }}>
                  {activeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
