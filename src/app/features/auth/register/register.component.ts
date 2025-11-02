import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

function matchPasswords(c: AbstractControl) {
  const p = c.get('password')?.value;
  const pc = c.get('password_confirmation')?.value;
  return p === pc ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 class="text-xl font-bold mb-4">Crear cuenta</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="mb-3">
          <label>Nombre</label>
          <input formControlName="name" class="w-full border p-2 rounded" />
        </div>
        <div class="mb-3">
          <label>Email</label>
          <input formControlName="email" class="w-full border p-2 rounded" />
        </div>
        <div class="mb-3">
          <label>Contraseña</label>
          <input type="password" formControlName="password" class="w-full border p-2 rounded" />
        </div>
        <div class="mb-3">
          <label>Confirmar Contraseña</label>
          <input type="password" formControlName="password_confirmation" class="w-full border p-2 rounded" />
        </div>
        <div *ngIf="error" class="text-red-500 mb-2">{{error}}</div>
        <button class="bg-blue-600 text-white px-4 py-2 rounded" [disabled]="loading">
          {{ loading ? 'Cargando...' : 'Registrarse' }}
        </button>
      </form>
    </div>
  `
})
export class RegisterComponent {
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', [Validators.required]]
  }, { validators: matchPasswords });
  loading = false;
  error: string | null = null;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}
  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    const v = this.form.value;
    this.auth.register(
  v.name ?? '',
  v.email ?? '',
  v.password ?? '',
  v.password_confirmation ?? ''
).subscribe({
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
          this.error = res.message || 'Error al registrar';
        }
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Error en la petición';
      }
    });
  }
}