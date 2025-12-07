import {CommonModule} from '@angular/common';
import {Component, OnInit, computed, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ProductosService} from './service/productos.service';
import {LucideAngularModule, Search} from 'lucide-angular';
import { CarritoService } from '../carrito/carrito.service';

@Component({
  selector: 'page-productos',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  private readonly productosService = inject(ProductosService);
  private readonly carritoService = inject(CarritoService);
  protected searchIcon = Search;

  protected readonly productos = signal<any[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly hasError = signal(false);
  protected readonly searchTerm = signal('');
  protected readonly selectedCategory = signal<string>('todos');

  protected readonly categories = computed(() => {
    const all = this.productos().map((producto) => producto.nombreCategoria);
    return ['todos', ...new Set(all)] as string[];
  });

  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    return this.productos().filter((producto) => {
      const matchesTerm = !term || producto.nombre.toLowerCase().includes(term) || producto.descripcion.toLowerCase().includes(term);
      const matchesCategory = category === 'todos' || producto.nombreCategoria === category;
      return matchesTerm && matchesCategory;
    });
  });

  protected readonly highlightedCount = computed(() => this.filteredProducts().length);

  ngOnInit(): void {
    this.obtenerProductos();
  }

  protected obtenerProductos(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.productosService.getProductos().subscribe({
      next: ({data, success}) => {
        if(!success){
          return
        }
        this.productos.set(data.content);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  protected trackById = (_: number, producto: any) => producto.idProducto;

  protected updateSearch(term: string): void {
    this.searchTerm.set(term);
  }

  protected selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  protected agregarAlCarrito(producto: any): void {
    try {
      this.carritoService.agregarProducto({
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        stock: producto.cantidad
      });
      
      alert('Producto agregado al carrito');
    } catch (error: any) {
      alert(error.message || 'Error al agregar producto al carrito');
    }
  }
}