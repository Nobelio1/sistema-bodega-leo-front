import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50">
      <div class="max-w-md text-center px-6">
        <div class="text-9xl mb-6 animate-bounce">🚫</div>
        <h1 class="text-5xl font-bold text-stone-900 mb-4">Acceso Denegado</h1>
        <p class="text-xl text-stone-600 mb-8">
          No tienes permisos para acceder a esta página
        </p>
        <div class="flex flex-col gap-4">
          <a [routerLink]="['/inicio']"
             class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all">
            Volver al Inicio
          </a>
          <a [routerLink]="['/auth/login']"
             class="bg-white text-stone-700 px-8 py-4 rounded-2xl font-semibold border-2 border-stone-200 hover:border-orange-300 transition-all">
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  `
})
export class AccesoDenegadoComponent {}
