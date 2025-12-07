import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService, Categoria } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-categorias-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-stone-900">Gestión de Categorías</h2>
          <p class="text-sm text-stone-600">Organiza tu catálogo</p>
        </div>
        <button (click)="mostrarFormulario = true"
                class="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all">
          + Nueva Categoría
        </button>
      </div>

      @if (mostrarFormulario) {
        <div class="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-300">
          <h3 class="text-xl font-bold text-stone-900 mb-4">
            {{ categoriaEditando ? 'Editar' : 'Nueva' }} Categoría
          </h3>
          <form (submit)="guardarCategoria()" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Nombre</label>
              <input type="text" [(ngModel)]="formulario.nombreCategoria" name="nombre"
                     class="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-orange-500 focus:outline-none"
                     placeholder="Nombre de la categoría" required/>
            </div>
            <div>
              <label class="block text-sm font-semibold text-stone-700 mb-2">Descripción</label>
              <textarea [(ngModel)]="formulario.descripcion" name="descripcion" rows="3"
                        class="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-orange-500 focus:outline-none"
                        placeholder="Descripción de la categoría" required></textarea>
            </div>
            <div class="flex gap-3">
              <button type="submit"
                      class="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600">
                {{ categoriaEditando ? 'Actualizar' : 'Crear' }}
              </button>
              <button type="button" (click)="cancelarFormulario()"
                      class="flex-1 bg-stone-200 text-stone-700 py-3 rounded-xl font-semibold hover:bg-stone-300">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @if (loading()) {
          @for (i of [1,2,3]; track i) {
            <div class="bg-white rounded-2xl p-6 animate-pulse">
              <div class="h-6 bg-stone-200 rounded mb-4"></div>
              <div class="h-4 bg-stone-200 rounded"></div>
            </div>
          }
        } @else {
          @for (categoria of categorias(); track categoria.idCategoria) {
            <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-stone-900 mb-2">{{ categoria.nombre }}</h3>
                  <p class="text-sm text-stone-600 mb-4">{{ categoria.descripcion }}</p>
                  <p class="text-sm text-orange-600 font-semibold">
                    {{ categoria.cantidadProductos || 0 }} productos
                  </p>
                </div>
                <span class="text-3xl">🏷️</span>
              </div>
              <div class="flex gap-2">
                <button (click)="editarCategoria(categoria)"
                        class="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600">
                  ✏️ Editar
                </button>
                <button (click)="eliminarCategoria(categoria.idCategoria)"
                        class="flex-1 bg-rose-500 text-white py-2 rounded-xl hover:bg-rose-600">
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class CategoriasAdminComponent implements OnInit {
  private readonly categoriaService = inject(CategoriaService);

  categorias = signal<Categoria[]>([]);
  loading = signal(false);
  mostrarFormulario = false;
  categoriaEditando: Categoria | null = null;

  formulario = {
    nombreCategoria: '',
    descripcion: ''
  };

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.loading.set(true);
    this.categoriaService.listarCategorias().subscribe({
      next: (response) => {
        if (response.success) {
          this.categorias.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  guardarCategoria(): void {
    if (this.categoriaEditando) {
      this.categoriaService.actualizarCategoria(this.categoriaEditando.idCategoria, this.formulario).subscribe({
        next: () => {
          alert('Categoría actualizada');
          this.cancelarFormulario();
          this.cargarCategorias();
        },
        error: () => alert('Error al actualizar')
      });
    } else {
      this.categoriaService.crearCategoria(this.formulario).subscribe({
        next: () => {
          alert('Categoría creada');
          this.cancelarFormulario();
          this.cargarCategorias();
        },
        error: () => alert('Error al crear')
      });
    }
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaEditando = categoria;
    this.formulario = {
      nombreCategoria: categoria.nombre,
      descripcion: categoria.descripcion || ''
    };
    this.mostrarFormulario = true;
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id).subscribe({
        next: () => {
          alert('Categoría eliminada');
          this.cargarCategorias();
        },
        error: () => alert('Error al eliminar')
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.categoriaEditando = null;
    this.formulario = { nombreCategoria: '', descripcion: '' };
  }
}
