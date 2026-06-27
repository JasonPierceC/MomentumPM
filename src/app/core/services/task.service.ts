import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Task, CreateTaskDto, UpdateTaskStatusDto } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly base = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getByProject(projectId: number) {
    return this.http.get<Task[]>(`${this.base}/project/${projectId}`);
  }

  getById(id: number) {
    return this.http.get<Task>(`${this.base}/${id}`);
  }

  create(dto: CreateTaskDto) {
    return this.http.post<Task>(this.base, dto);
  }

  update(id: number, dto: Partial<CreateTaskDto>) {
    return this.http.put<Task>(`${this.base}/${id}`, dto);
  }

  updateStatus(id: number, dto: UpdateTaskStatusDto) {
    return this.http.patch<Task>(`${this.base}/${id}/status`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
