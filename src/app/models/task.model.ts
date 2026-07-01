export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface User {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
}

export interface Task {
  id: string;
  userId: string; // Task owner identifier
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string; // ISO date string
  assignedTo: string;
  status: TaskStatus;
  createdAt: string;
}

export type TaskDraft = Omit<Task, 'id' | 'status' | 'createdAt' | 'userId'>;
