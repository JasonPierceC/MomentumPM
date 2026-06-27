export interface Project {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  ownerUsername: string;
  createdAt: string;
  taskCount: number;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
}
