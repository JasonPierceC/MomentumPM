import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { Task, PRIORITY_COLORS, PRIORITIES } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule, MatIconModule, MatChipsModule, DatePipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;

  get priorityLabel(): string {
    return PRIORITIES[this.task.priority] ?? 'Medium';
  }

  get priorityColor(): string {
    return PRIORITY_COLORS[this.priorityLabel as keyof typeof PRIORITY_COLORS] ?? '#9e9e9e';
  }

  get isOverdue(): boolean {
    if (!this.task.dueDate) return false;
    return new Date(this.task.dueDate) < new Date();
  }
}
