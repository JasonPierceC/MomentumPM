export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  taskId: number;
  authorId: number;
  authorUsername: string;
}

export interface CreateCommentDto {
  content: string;
  taskId: number;
}
