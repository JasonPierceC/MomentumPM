import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _dark = signal(localStorage.getItem('pm-theme') === 'dark');
  readonly isDark = this._dark.asReadonly();

  init() {
    document.documentElement.classList.toggle('dark', this._dark());
  }

  toggle() {
    const next = !this._dark();
    this._dark.set(next);
    localStorage.setItem('pm-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  }
}
