import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Project, CreateProjectDto } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly base = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Project[]>(this.base);
  }

  getById(id: number) {
    return this.http.get<Project>(`${this.base}/${id}`);
  }

  create(dto: CreateProjectDto) {
    return this.http.post<Project>(this.base, dto);
  }

  update(id: number, dto: CreateProjectDto) {
    return this.http.put<Project>(`${this.base}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
