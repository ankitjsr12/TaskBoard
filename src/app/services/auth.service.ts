import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/task.model';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'task-board.token';
const USER_KEY = 'task-board.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadSession());
  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private readonly API_URL = `${environment.apiUrl}/auth`;

  private loadSession(): User | null {
    try {
      const token = sessionStorage.getItem(TOKEN_KEY);
      const userRaw = sessionStorage.getItem(USER_KEY);
      if (token && userRaw) {
        return JSON.parse(userRaw) as User;
      }
    } catch {
      // ignore storage errors
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(TOKEN_KEY);
  }

  signUp(email: string, password: string, fullName: string): Observable<User> {
    const normalizedEmail = email.toLowerCase().trim();
    return this.http.post<User>(`${this.API_URL}/register/`, {
      email: normalizedEmail,
      password,
      fullName: fullName.trim(),
    });
  }

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    const normalizedEmail = email.toLowerCase().trim();
    return this.http.post<{ token: string; user: User }>(`${this.API_URL}/login/`, {
      email: normalizedEmail,
      password,
    }).pipe(
      tap((res) => {
        sessionStorage.setItem(TOKEN_KEY, res.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
    this.currentUserSubject.next(null);
  }
}
