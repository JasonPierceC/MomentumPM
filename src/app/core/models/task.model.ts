export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Todo' | 'InProgress' | 'InReview' | 'Done';

export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
export const TASK_STATUSES: TaskStatus[] = ['Todo', 'InProgress', 'InReview', 'Done'];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  Todo: 'To Do',
  InProgress: 'In Progress',
  InReview: 'In Review',
  Done: 'Done'
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  Low: '#4caf50',
  Medium: '#2196f3',
  High: '#ff9800',
  Critical: '#f44336'
};

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: number;
  status: number;
  dueDate?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  projectId: number;
  projectName: string;
  creatorId: number;
  creatorUsername: string;
  assigneeId?: number;
  assigneeUsername?: string;
  commentCount: number;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId: number;
  assigneeId?: number;
  priority: number;
  status: number;
  dueDate?: string;
}

export interface UpdateTaskStatusDto {
  status: number;
  order: number;
}
