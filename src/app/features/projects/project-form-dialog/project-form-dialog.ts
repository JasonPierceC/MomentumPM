import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Project' : 'New Project' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Project Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g. Website Redesign">
          @if (form.get('name')?.hasError('required')) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description (optional)</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="What is this project about?"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button (click)="save()" [disabled]="form.invalid || loading">
        {{ isEdit ? 'Save' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; } .form { display: flex; flex-direction: column; gap: 4px; min-width: 400px; }`]
})
export class ProjectFormDialogComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private dialogRef = inject(MatDialogRef<ProjectFormDialogComponent>);
  private data: Project | null = inject(MAT_DIALOG_DATA, { optional: true });

  isEdit = !!this.data;
  loading = false;

  form = this.fb.group({
    name: [this.data?.name ?? '', Validators.required],
    description: [this.data?.description ?? '']
  });

  save() {
    if (this.form.invalid) return;
    this.loading = true;
    const dto = this.form.value as any;

    const req = this.isEdit
      ? this.projectService.update(this.data!.id, dto)
      : this.projectService.create(dto);

    req.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => { this.loading = false; }
    });
  }
}
