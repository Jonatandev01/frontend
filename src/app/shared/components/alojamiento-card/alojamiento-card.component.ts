import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { Alojamiento } from '../../interfaces/alojamiento.interface';

@Component({
  selector: 'app-alojamiento-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded shadow overflow-hidden hover:scale-105 transform transition">
      <img [src]="alojamiento.imagen_url" alt="{{alojamiento.nombre}}" class="h-44 w-full object-cover" />
      <div class="p-3">
        <h3 class="font-bold">{{alojamiento.nombre}}</h3>
        <p class="text-sm text-gray-600">{{alojamiento.ubicacion}}</p>
        <div class="mt-2 flex justify-between items-center">
          <span class="font-semibold text-blue-600">{{ alojamiento.precio | currency:'USD' }}</span>
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AlojamientoCardComponent {
  @Input() alojamiento!: Alojamiento;
}
