import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlojamientoService } from '../../../core/services/alojamiento.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto">
      <h2 class="text-2xl font-bold mb-4">Admin Panel</h2>

      <div class="bg-white p-4 rounded shadow mb-6 max-w-xl">
        <h3 class="font-semibold mb-2">Crear Alojamiento</h3>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <input formControlName="nombre" placeholder="Nombre" class="w-full border p-2 mb-2 rounded" />
          <textarea formControlName="descripcion" placeholder="Descripción" class="w-full border p-2 mb-2 rounded"></textarea>
          <input formControlName="precio" type="number" placeholder="Precio" class="w-full border p-2 mb-2 rounded" />
          <input formControlName="imagen_url" placeholder="Imagen URL" class="w-full border p-2 mb-2 rounded" />
          <input formControlName="ubicacion" placeholder="Ubicación" class="w-full border p-2 mb-2 rounded" />
          <div *ngIf="error" class="text-red-500 mb-2">{{error}}</div>
          <button class="bg-green-500 text-white px-4 py-2 rounded" [disabled]="loading">{{ loading ? 'Creando...' : 'Crear Alojamiento' }}</button>
        </form>
      </div>

      <div>
        <h3 class="font-semibold">Todos los Alojamientos</h3>
        <div *ngIf="loadingAll">Cargando...</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let a of all">
            <div class="bg-white rounded shadow overflow-hidden">
              <img [src]="a.imagen_url" class="h-40 w-full object-cover" />
              <div class="p-3">
                <h4 class="font-bold">{{a.nombre}}</h4>
                <p class="text-sm text-gray-600">{{a.ubicacion}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    descripcion: ['', [Validators.required]],
    precio: [0, [Validators.required, Validators.min(0)]],
    imagen_url: ['', [Validators.required]],
    ubicacion: ['', [Validators.required, Validators.maxLength(255)]]
  });
  loading = false;
  error: string | null = null;
  all: any[] = [];
  loadingAll = false;
  constructor(private fb: FormBuilder, private svc: AlojamientoService) {}
  ngOnInit() {
    this.loadAll();
  }
  loadAll() {
    this.loadingAll = true;
    this.svc.getAllAlojamientos().subscribe({
      next: res => {
        this.loadingAll = false;
        if (res.success && res.data) this.all = res.data;
      }, error: () => this.loadingAll = false
    });
  }
  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.svc.createAlojamiento({
  ...this.form.value,
  nombre: this.form.value.nombre ?? '',
  descripcion: this.form.value.descripcion ?? '',
  precio: this.form.value.precio ?? 0,
  ubicacion: this.form.value.ubicacion ?? '',
  imagen_url: this.form.value.imagen_url ?? ''
}).subscribe({

      next: res => {
        this.loading = false;
        if (res.success && res.data) {
          this.all.unshift(res.data);
          this.form.reset();
        } else {
          this.error = res.message || 'Error';
        }
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Error en la petición';
      }
    });
  }
}