import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { DatePipe } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { ProjectFormDialogComponent } from '../project-form-dialog/project-form-dialog';

@Component({
  selector: 'app-project-list',
  imports: [
    DatePipe,
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatMenuModule
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss'
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  projects = signal<Project[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading.set(true);
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openCreateDialog() {
    const ref = this.dialog.open(ProjectFormDialogComponent, { width: '480px' });
    ref.afterClosed().subscribe(result => {
      if (result) this.loadProjects();
    });
  }

  openEditDialog(project: Project) {
    const ref = this.dialog.open(ProjectFormDialogComponent, {
      width: '480px',
      data: project
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.loadProjects();
    });
  }

  openKanban(project: Project) {
    this.router.navigate(['/projects', project.id, 'kanban']);
  }

  deleteProject(project: Project) {
    if (!confirm(`Delete "${project.name}"? This will also delete all tasks.`)) return;
    this.projectService.delete(project.id).subscribe(() => this.loadProjects());
  }
}
