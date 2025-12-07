import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService, ClienteRes } from '../../../core/services/cliente.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-stone-900">Gestión de Clientes</h2>
        <p class="text-sm text-stone-600">Información de clientes registrados</p>
      </div>

      <!-- Búsqueda -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <input type="search"
               [(ngModel)]="searchTerm"
               (input)="filtrarClientes()"
               placeholder="Buscar por nombre, teléfono o correo..."
               class="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-orange-500 focus:outline-none"/>
      </div>

      <!-- Grid de clientes -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @if (loading()) {
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="bg-white rounded-2xl p-6 animate-pulse">
              <div class="h-6 bg-stone-200 rounded mb-4"></div>
              <div class="h-4 bg-stone-200 rounded mb-2"></div>
              <div class="h-4 bg-stone-200 rounded w-2/3"></div>
            </div>
          }
        } @else {
          @for (cliente of clientesFiltrados(); track cliente.idCliente) {
            <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {{ getInitials(cliente.nombre) }}
                  </div>
                  <div>
                    <h3 class="font-bold text-stone-900">{{ cliente.nombre }}</h3>
                    <p class="text-xs text-stone-500">@{{ cliente.nombreUsuario }}</p>
                  </div>
                </div>
                <span class="text-3xl">👤</span>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2 text-stone-600">
                  <span class="text-lg">📞</span>
                  <span>{{ cliente.telefono }}</span>
                </div>
                <div class="flex items-center gap-2 text-stone-600">
                  <span class="text-lg">📧</span>
                  <span class="truncate">{{ cliente.correo }}</span>
                </div>
                <div class="flex items-center gap-2 text-stone-600">
                  <span class="text-lg">📍</span>
                  <span class="truncate">{{ cliente.direccion }}</span>
                </div>
              </div>

              <div class="mt-4 pt-4 border-t border-stone-100">
                <button class="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition font-semibold">
                  Ver Pedidos
                </button>
              </div>
            </div>
          }
        }
      </div>

      @if (!loading() && clientesFiltrados().length === 0) {
        <div class="bg-white rounded-2xl p-12 text-center">
          <div class="text-6xl mb-4">🔍</div>
          <p class="text-stone-600">No se encontraron clientes</p>
        </div>
      }
    </div>
  `
})
export class ClientesAdminComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);

  clientes = signal<ClienteRes[]>([]);
  clientesFiltrados = signal<ClienteRes[]>([]);
  loading = signal(true);
  searchTerm = '';

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading.set(true);
    this.clienteService.listarClientes().subscribe({
      next: (response) => {
        if (response.success) {
          this.clientes.set(response.data);
          this.clientesFiltrados.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filtrarClientes(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.clientesFiltrados.set(this.clientes());
      return;
    }
    const filtered = this.clientes().filter(c =>
      c.nombre.toLowerCase().includes(term) ||
      c.telefono.includes(term) ||
      c.correo.toLowerCase().includes(term)
    );
    this.clientesFiltrados.set(filtered);
  }

  getInitials(nombre: string): string {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}
