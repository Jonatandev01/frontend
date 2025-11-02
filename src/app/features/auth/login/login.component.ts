import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 class="text-xl font-bold mb-4">Iniciar Sesión</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="mb-3">
          <label>Email</label>
          <input formControlName="email" class="w-full border p-2 rounded" />
        </div>
        <div class="mb-3">
          <label>Contraseña</label>
          <input type="password" formControlName="password" class="w-full border p-2 rounded" />
        </div>
        <div *ngIf="error" class="text-red-500 mb-2">{{error}}</div>
        <button class="bg-blue-600 text-white px-4 py-2 rounded" [disabled]="loading">
          {{ loading ? 'Cargando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  `
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  loading = false;
  error: string | null = null;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}
  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    const { email, password } = this.form.value;
    this.auth.login(email ?? '', password ?? '').subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data?.token) {
          this.auth.getCurrentUser().subscribe({
            next: () => {
              const role = this.auth.currentUser$.value?.role;
              if (role === 'admin') this.router.navigate(['/admin/dashboard']);
              else this.router.navigate(['/user/dashboard']);
            },
            error: () => this.router.navigate(['/'])
          });
        } else {
          this.error = res.message || 'Error al iniciar sesión';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error en la petición';
      }
    });
  }
}