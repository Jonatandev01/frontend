import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import type { ApiResponse } from '../../shared/interfaces/api-response.interface';
import type { AuthResponse, User } from '../../shared/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser$ = new BehaviorSubject<User | null>(null);
  private tokenKey = 'token';

  constructor(private http: HttpClient) {
    const t = this.getToken();
    if (t) {
      this.getCurrentUser().subscribe({
        next: (res) => {
          if (res.success && res.data) this.currentUser$.next(res.data);
        },
        error: () => this.removeToken()
      });
    }
  }

  register(name: string, email: string, password: string, password_confirmation: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/register`, { name, email, password, password_confirmation }).pipe(
      tap(res => {
        if (res.success && res.data?.token) {
          this.saveToken(res.data.token);
        }
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        if (res.success && res.data?.token) {
          this.saveToken(res.data.token);
        }
      })
    );
  }

  logout() {
    return this.http.post<ApiResponse<any>>(`${environment.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.removeToken();
      })
    );
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/user`).pipe(
      tap(res => {
        if (res.success && res.data) this.currentUser$.next(res.data);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
  removeToken() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser$.next(null);
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  isAdmin(): boolean {
    return this.currentUser$.value?.role === 'admin';
  }
}