export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: string;
  subtasks: SubTask[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // css variable name or color code
  icon: string;  // lucide icon name
}
