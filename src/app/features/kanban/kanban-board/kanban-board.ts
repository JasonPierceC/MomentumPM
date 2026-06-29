import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SkeletonComponent } from '../../../shared/skeleton/skeleton';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { Task, TaskStatus, TASK_STATUSES, STATUS_LABELS, PRIORITIES, PRIORITY_COLORS } from '../../../core/models/task.model';
import { Project } from '../../../core/models/project.model';
import { TaskDialogComponent } from '../task-dialog/task-dialog';
import { TaskCardComponent } from '../task-card/task-card';

@Component({
  selector: 'app-kanban-board',
  imports: [
    RouterLink, DragDropModule, DatePipe,
    MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatFormFieldModule, MatInputModule,
    MatButtonToggleModule, MatTooltipModule, SkeletonComponent,
    TaskCardComponent
  ],
  templateUrl: './kanban-board.html',
  styleUrl: './kanban-board.scss'
})
export class KanbanBoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);

  project = signal<Project | null>(null);
  loading = signal(true);
  viewMode = signal<'kanban' | 'list'>('kanban');
  searchQuery = signal('');
  priorityFilter = signal<number | null>(null);

  readonly statuses = TASK_STATUSES;
  readonly statusLabels = STATUS_LABELS;
  readonly priorities = PRIORITIES;
  readonly priorityColors = PRIORITY_COLORS;

  columns = signal<Record<TaskStatus, Task[]>>({
    Todo: [], InProgress: [], InReview: [], Done: []
  });

  readonly projectId = computed(() => +this.route.snapshot.paramMap.get('id')!);
  readonly connectedLists = TASK_STATUSES.map(s => `list-${s}`);

  readonly isFiltered = computed(() =>
    !!this.searchQuery().trim() || this.priorityFilter() !== null
  );

  private readonly filteredBase = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const p = this.priorityFilter();
    const all = TASK_STATUSES.flatMap(s => this.columns()[s]);
    return all.filter(t =>
      (!q || t.title.toLowerCase().includes(q)) &&
      (p === null || t.priority === p)
    );
  });

  readonly filteredColumns = computed(() => {
    const result: Record<TaskStatus, Task[]> = { Todo: [], InProgress: [], InReview: [], Done: [] };
    for (const t of this.filteredBase()) result[this.numToStatus(t.status)].push(t);
    return result;
  });

  readonly filteredTasks = computed(() =>
    this.filteredBase().slice().sort((a, b) => a.status - b.status || a.order - b.order)
  );

  ngOnInit() {
    const id = this.projectId();
    this.projectService.getById(id).subscribe(p => this.project.set(p));
    this.loadTasks();
  }

  loadTasks() {
    this.loading.set(true);
    this.taskService.getByProject(this.projectId()).subscribe({
      next: (tasks) => {
        const cols: Record<TaskStatus, Task[]> = { Todo: [], InProgress: [], InReview: [], Done: [] };
        for (const task of tasks) cols[this.numToStatus(task.status)].push(task);
        this.columns.set(cols);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  drop(event: CdkDragDrop<Task[]>, targetStatus: TaskStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    const task = event.container.data[event.currentIndex];
    this.taskService.updateStatus(task.id, {
      status: this.statusToNum(targetStatus),
      order: event.currentIndex
    }).subscribe();
  }

  openCreateDialog(status: TaskStatus) {
    const ref = this.dialog.open(TaskDialogComponent, {
      width: '560px',
      data: { projectId: this.projectId(), defaultStatus: this.statusToNum(status) }
    });
    ref.afterClosed().subscribe(result => { if (result) this.loadTasks(); });
  }

  openTaskDialog(task: Task) {
    const ref = this.dialog.open(TaskDialogComponent, {
      width: '560px',
      data: { task, projectId: this.projectId() }
    });
    ref.afterClosed().subscribe(result => { if (result) this.loadTasks(); });
  }

  getColumnTasks(status: TaskStatus): Task[] {
    return this.isFiltered() ? this.filteredColumns()[status] : this.columns()[status];
  }

  togglePriorityFilter(index: number) {
    this.priorityFilter.set(this.priorityFilter() === index ? null : index);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.priorityFilter.set(null);
  }

  onSearchInput(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  getPriorityColor(priority: number): string {
    return this.priorityColors[this.priorities[priority] as keyof typeof this.priorityColors] ?? '#9e9e9e';
  }

  getPriorityLabel(priority: number): string {
    return this.priorities[priority] ?? 'Medium';
  }

  isOverdue(task: Task): boolean {
    return !!task.dueDate && new Date(task.dueDate) < new Date();
  }

  numToStatus(n: number): TaskStatus { return TASK_STATUSES[n] ?? 'Todo'; }
  statusToNum(s: TaskStatus): number { return TASK_STATUSES.indexOf(s); }
}
