import { Component, OnInit } from '@angular/core';
import { AlojamientoService } from '../../../core/services/alojamiento.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { AlojamientoCardComponent } from '../../../shared/components/alojamiento-card/alojamiento-card.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, AlojamientoCardComponent],
  template: `
    <div class="container mx-auto">
      <h2 class="text-2xl font-bold mb-4">Panel de Usuario</h2>
      <div class="mb-6">
        <h3 class="font-semibold">Todos los Alojamientos</h3>
        <div *ngIf="loadingAll">Cargando...</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let a of all">
            <app-alojamiento-card [alojamiento]="a">
              <button class="px-2 py-1 border rounded" (click)="add(a.id)" *ngIf="!isInMine(a.id)">Agregar</button>
              <span *ngIf="isInMine(a.id)" class="text-green-600 font-semibold">En mis alojamientos</span>
            </app-alojamiento-card>
          </div>
        </div>
      </div>

      <div>
        <h3 class="font-semibold">Mis Alojamientos</h3>
        <div *ngIf="loadingMine">Cargando...</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let a of mine">
            <app-alojamiento-card [alojamiento]="a">
              <button class="px-2 py-1 border rounded bg-red-500 text-white" (click)="remove(a.id)">Eliminar</button>
            </app-alojamiento-card>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserDashboardComponent implements OnInit {
  all: any[] = [];
  mine: any[] = [];
  loadingAll = false;
  loadingMine = false;
  constructor(private svc: AlojamientoService, public auth: AuthService) {}
  ngOnInit() {
    this.loadAll();
    this.loadMine();
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
  loadMine() {
    this.loadingMine = true;
    this.svc.getMisAlojamientos().subscribe({
      next: res => {
        this.loadingMine = false;
        if (res.success && res.data) this.mine = res.data;
      }, error: () => this.loadingMine = false
    });
  }
  isInMine(id: number) {
    return this.mine.some(m => m.id === id);
  }
  add(id: number) {
    this.svc.addToMisAlojamientos(id).subscribe({
      next: (res) => {
        if (res.success && res.data) this.mine.push(res.data);
      },
      error: (err) => {
        alert(err?.error?.message || 'Error');
      }
    });
  }
  remove(id: number) {
    this.svc.removeFromMisAlojamientos(id).subscribe({
      next: (res) => {
        if (res.success) this.mine = this.mine.filter(m => m.id !== id);
      }, error: (err) => alert(err?.error?.message || 'Error')
    });
  }
}