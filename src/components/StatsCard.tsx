"use client";

import { CheckCircle2, AlertCircle, Calendar, ClipboardList } from "lucide-react";

interface StatsCardProps {
  completedCount: number;
  totalCount: number;
  highPriorityCount: number;
  overdueCount: number;
}

export default function StatsCard({
  completedCount,
  totalCount,
  highPriorityCount,
  overdueCount,
}: StatsCardProps) {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Overview</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Your progress today</p>
        </div>
        
        {/* Radial progress */}
        <div style={{ position: "relative", width: "80px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg style={{ transform: "rotate(-90deg)", width: "80px", height: "80px" }}>
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="var(--border-color)"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="var(--primary)"
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ 
                transition: "stroke-dashoffset 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                filter: "drop-shadow(0px 0px 4px var(--primary-glow))"
              }}
            />
          </svg>
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)"
          }}>
            {percentage}%
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={{
          background: "var(--bg-base)",
          padding: "12px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{
            background: "rgba(99, 102, 241, 0.1)",
            color: "var(--primary)",
            padding: "8px",
            borderRadius: "8px",
            display: "flex"
          }}>
            <ClipboardList size={18} />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{totalCount}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Total Tasks</div>
          </div>
        </div>

        <div style={{
          background: "var(--bg-base)",
          padding: "12px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{
            background: "rgba(16, 185, 129, 0.1)",
            color: "var(--priority-low)",
            padding: "8px",
            borderRadius: "8px",
            display: "flex"
          }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{completedCount}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Completed</div>
          </div>
        </div>

        <div style={{
          background: "var(--bg-base)",
          padding: "12px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{
            background: "var(--priority-high-bg)",
            color: "var(--priority-high)",
            padding: "8px",
            borderRadius: "8px",
            display: "flex"
          }}>
            <AlertCircle size={18} />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{highPriorityCount}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>High Priority</div>
          </div>
        </div>

        <div style={{
          background: "var(--bg-base)",
          padding: "12px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{
            background: "rgba(234, 179, 8, 0.1)",
            color: "var(--priority-medium)",
            padding: "8px",
            borderRadius: "8px",
            display: "flex"
          }}>
            <Calendar size={18} />
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>{overdueCount}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Overdue</div>
          </div>
        </div>
      </div>
    </div>
  );
}
