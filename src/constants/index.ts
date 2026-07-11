import { Category } from "@/types";

export const CATEGORIES: Category[] = [
  { id: "work", name: "Work", color: "var(--cat-work)", icon: "Briefcase" },
  { id: "personal", name: "Personal", color: "var(--cat-personal)", icon: "User" },
  { id: "health", name: "Health & Wellness", color: "var(--cat-health)", icon: "Heart" },
  { id: "finance", name: "Finance", color: "var(--cat-finance)", icon: "DollarSign" },
  { id: "learning", name: "Learning", color: "var(--cat-learning)", icon: "BookOpen" },
  { id: "other", name: "Other", color: "var(--cat-other)", icon: "Tag" },
];

export const PRIORITIES = [
  { id: "low", name: "Low", color: "var(--priority-low)", bg: "var(--priority-low-bg)" },
  { id: "medium", name: "Medium", color: "var(--priority-medium)", bg: "var(--priority-medium-bg)" },
  { id: "high", name: "High", color: "var(--priority-high)", bg: "var(--priority-high-bg)" },
];
