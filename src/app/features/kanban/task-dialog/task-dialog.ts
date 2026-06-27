import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../../core/services/task.service';
import { CommentService } from '../../../core/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Task, PRIORITIES, TASK_STATUSES, STATUS_LABELS, PRIORITY_COLORS } from '../../../core/models/task.model';
import { Comment } from '../../../core/models/comment.model';

interface DialogData {
  task?: Task;
  projectId: number;
  defaultStatus?: number;
}

@Component({
  selector: 'app-task-dialog',
  imports: [
    ReactiveFormsModule, FormsModule, DatePipe,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatDatepickerModule,
    MatDividerModule, MatProgressSpinnerModule
  ],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.scss'
})
export class TaskDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private commentService = inject(CommentService);
  protected auth = inject(AuthService);
  private dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  protected data: DialogData = inject(MAT_DIALOG_DATA);

  readonly priorities = PRIORITIES;
  readonly statuses = TASK_STATUSES;
  readonly statusLabels = STATUS_LABELS;
  readonly priorityColors = PRIORITY_COLORS;

  isEdit = !!this.data.task;
  loading = false;
  comments = signal<Comment[]>([]);
  newComment = '';

  form = this.fb.group({
    title: [this.data.task?.title ?? '', Validators.required],
    description: [this.data.task?.description ?? ''],
    priority: [this.data.task?.priority ?? 1],
    status: [this.data.task?.status ?? (this.data.defaultStatus ?? 0)],
    dueDate: [this.data.task?.dueDate ? new Date(this.data.task.dueDate) : null]
  });

  ngOnInit() {
    if (this.isEdit) {
      this.loadComments();
    }
  }

  loadComments() {
    this.commentService.getByTask(this.data.task!.id).subscribe(c => this.comments.set(c));
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;

    const rawDate = this.form.value.dueDate;
    const dueDate = rawDate ? (rawDate as Date).toISOString().split('T')[0] : undefined;

    const dto = { ...this.form.value, dueDate, projectId: this.data.projectId } as any;

    const req = this.isEdit
      ? this.taskService.update(this.data.task!.id, dto)
      : this.taskService.create(dto);

    req.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => { this.loading = false; }
    });
  }

  deleteTask() {
    if (!confirm('Delete this task?')) return;
    this.taskService.delete(this.data.task!.id).subscribe(() => this.dialogRef.close(true));
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.commentService.create({ content: this.newComment, taskId: this.data.task!.id }).subscribe(c => {
      this.comments.update(prev => [...prev, c]);
      this.newComment = '';
    });
  }

  deleteComment(id: number) {
    this.commentService.delete(id).subscribe(() => {
      this.comments.update(prev => prev.filter(c => c.id !== id));
    });
  }

  getPriorityColor(index: number): string {
    return this.priorityColors[this.priorities[index] as keyof typeof this.priorityColors] ?? '#9e9e9e';
  }
}
