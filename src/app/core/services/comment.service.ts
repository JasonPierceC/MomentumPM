import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Comment, CreateCommentDto } from '../models/comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly base = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  getByTask(taskId: number) {
    return this.http.get<Comment[]>(`${this.base}/task/${taskId}`);
  }

  create(dto: CreateCommentDto) {
    return this.http.post<Comment>(this.base, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
