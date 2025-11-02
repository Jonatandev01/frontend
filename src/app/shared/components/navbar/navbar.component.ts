import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  template: `
    <nav class="bg-white shadow p-4 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <a routerLink="/" class="text-xl font-bold text-blue-600 cursor-pointer">Alojamientos</a>
      </div>
      <div class="flex items-center gap-4">
        <ng-container *ngIf="(auth.currentUser$ | async) as user; else guest">
          <span class="hidden sm:inline">Hola, {{user.name}}</span>
          <a *ngIf="user.role==='admin'" routerLink="/admin/dashboard" 
             class="px-3 py-1 border rounded cursor-pointer hover:bg-gray-100">Admin</a>
          <a routerLink="/user/dashboard" 
             class="px-3 py-1 border rounded cursor-pointer hover:bg-gray-100">Mi panel</a>
          <button (click)="logout()" 
                  class="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600">
            Cerrar Sesión
          </button>
        </ng-container>
        <ng-template #guest>
          <a routerLink="/login" 
             class="px-3 py-1 cursor-pointer hover:underline">Iniciar Sesión</a>
          <a routerLink="/register" 
             class="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
            Registrarse
          </a>
        </ng-template>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}
  
  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.auth.removeToken();
        this.router.navigate(['/']);
      }
    });
  }
}