import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../../pages/productos/service/productos.service';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-stone-900">Gestión de Productos</h2>
          <p class="text-sm text-stone-600">Administra tu catálogo completo</p>
        </div>
        <button (click)="abrirModalCrear()"
                class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all">
          + Nuevo Producto
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex gap-4">
                 <input type="search"
                        #searchInput
                        (input)="filtrarProductos()"
                        placeholder="Buscar productos..."
                        class="flex-1 px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-orange-500 focus:outline-none"/>

        </div>
      </div>

      <!-- Grid de productos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @if (loading()) {
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="bg-white rounded-2xl p-6 animate-pulse">
              <div class="h-48 bg-stone-200 rounded-xl mb-4"></div>
              <div class="h-4 bg-stone-200 rounded mb-2"></div>
              <div class="h-4 bg-stone-200 rounded w-2/3"></div>
            </div>
          }
        } @else {
          @for (producto of productosFiltrados(); track producto.idProducto) {
            <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="relative h-48 mb-4 rounded-xl overflow-hidden bg-stone-100">
                @if (producto.imagen) {
                  <img [src]="producto.imagen" [alt]="producto.nombre"
                       class="w-full h-full object-cover"/>
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-6xl">
                    📦
                  </div>
                }
                <span class="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold"
                      [class]="producto.cantidad > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                  {{ producto.cantidad > 0 ? 'En stock' : 'Agotado' }}
                </span>
              </div>

              <h3 class="font-bold text-stone-900 mb-2">{{ producto.nombre }}</h3>
              <p class="text-sm text-stone-600 mb-4 line-clamp-2">{{ producto.descripcion }}</p>

              <div class="flex items-center justify-between mb-4">
                <div>
                  <p class="text-2xl font-bold text-orange-600">S/ {{ producto.precio | number: '1.0-2' }}</p>
                  <p class="text-sm text-stone-500">Stock: {{ producto.cantidad }}</p>
                </div>
              </div>

              <div class="flex gap-2">
                <button (click)="editarProducto(producto)"
                        class="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition">
                  ✏️ Editar
                </button>
                <button (click)="cambiarEstado(producto.idProducto)"
                        class="flex-1 bg-amber-500 text-white py-2 rounded-xl hover:bg-amber-600 transition">
                  🔄 Estado
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class ProductosAdminComponent implements OnInit {
  private readonly productosService = inject(ProductosService);

  productos = signal<any[]>([]);
  productosFiltrados = signal<any[]>([]);
  loading = signal(false);
  searchTerm = '';

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading.set(true);
    this.productosService.getProductos().subscribe({
      next: ({data}) => {
        this.productos.set(data.content);
        this.productosFiltrados.set(data.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filtrarProductos(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.productosFiltrados.set(this.productos());
      return;
    }
    const filtered = this.productos().filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term)
    );
    this.productosFiltrados.set(filtered);
  }

  abrirModalCrear(): void {
    alert('Modal de crear producto - Implementar según necesidad');
  }

  editarProducto(producto: any): void {
    alert('Editar producto: ' + producto.nombre);
  }

  cambiarEstado(id: number): void {
    if (confirm('¿Cambiar estado del producto?')) {
      alert('Cambiar estado: ' + id);
    }
  }
}
