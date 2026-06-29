import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `<div class="sk" [style.height.px]="height" [style.border-radius.px]="radius" [style.width]="width"></div>`,
  styles: [`
    .sk {
      background: linear-gradient(90deg, var(--pm-skeleton-from) 25%, var(--pm-skeleton-to) 50%, var(--pm-skeleton-from) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      margin-bottom: 10px;
    }
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonComponent {
  @Input() height = 16;
  @Input() radius = 4;
  @Input() width = '100%';
}
