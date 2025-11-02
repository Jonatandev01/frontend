import { Component, OnInit } from '@angular/core';
import { AlojamientoService } from '../../core/services/alojamiento.service';
import { CommonModule } from '@angular/common';
import { AlojamientoCardComponent } from '../../shared/components/alojamiento-card/alojamiento-card.component';
import { Observable } from 'rxjs';
import type { Alojamiento } from '../../shared/interfaces/alojamiento.interface';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, AlojamientoCardComponent],
  template: `
    <section class="container mx-auto">
      <div class="text-center my-8">
        <h1 class="text-3xl font-bold">Encuentra tu próximo alojamiento</h1>
        <p class="text-gray-600">Explora los alojamientos disponibles</p>
      </div>

      <div *ngIf="loading" class="text-center">Cargando...</div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ng-container *ngFor="let a of alojamientos">
          <app-alojamiento-card [alojamiento]="a"></app-alojamiento-card>
        </ng-container>
      </div>
    </section>
  `
})
export class LandingComponent implements OnInit {
  alojamientos: Alojamiento[] = [];
  loading = false;
  constructor(private svc: AlojamientoService) {}
  ngOnInit() {
    this.loading = true;
    this.svc.getAllAlojamientos().subscribe({
      next: res => {
        this.loading = false;
        if (res.success && res.data) this.alojamientos = res.data;
      },
      error: () => this.loading = false
    });
  }
}