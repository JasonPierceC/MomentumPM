import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { SkeletonComponent } from '../../shared/skeleton/skeleton';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { Dashboard } from '../../core/models/dashboard.model';
import { PRIORITY_COLORS } from '../../core/models/task.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, SkeletonComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  protected readonly auth = inject(AuthService);

  dashboard = signal<Dashboard | null>(null);
  loading = signal(true);
  readonly priorityColors = PRIORITY_COLORS;

  ngOnInit() {
    this.dashboardService.get().subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getStatusEntries(map: Record<string, number>) {
    return Object.entries(map);
  }

  getPriorityColor(priority: string): string {
    return this.priorityColors[priority as keyof typeof this.priorityColors] ?? '#9e9e9e';
  }
}
