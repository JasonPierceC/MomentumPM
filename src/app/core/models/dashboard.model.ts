export interface Dashboard {
  totalProjects: number;
  totalTasks: number;
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  overdueTasks: number;
  recentTasks: RecentTask[];
}

export interface RecentTask {
  id: number;
  title: string;
  projectName: string;
  status: string;
  priority: string;
  dueDate?: string;
}
