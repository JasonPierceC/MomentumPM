import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthUser, AuthResponse, LoginDto, RegisterDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<AuthUser | null>(null);

  readonly currentUser = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('user');
    if (stored) {
      this._user.set(JSON.parse(stored));
    }
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  login(dto: LoginDto) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, dto).pipe(
      tap(res => this.setSession(res))
    );
  }

  register(dto: RegisterDto) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, dto).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    const user: AuthUser = { userId: res.userId, username: res.username, email: res.email };
    localStorage.setItem('user', JSON.stringify(user));
    this._user.set(user);
  }
}
