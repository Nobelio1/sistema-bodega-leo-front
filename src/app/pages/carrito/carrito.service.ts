import { Injectable, signal, computed } from '@angular/core';

export interface ItemCarrito {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private readonly STORAGE_KEY = 'carrito_bodega_leo';
  
  private items = signal<ItemCarrito[]>([]);
  
  public itemsCarrito = this.items.asReadonly();
  
  public totalItems = computed(() => 
    this.items().reduce((total, item) => total + item.cantidad, 0)
  );
  
  public subtotal = computed(() => 
    this.items().reduce((total, item) => total + (item.precio * item.cantidad), 0)
  );
  
  public igv = computed(() => this.subtotal() * 0.18);
  
  public total = computed(() => this.subtotal() + this.igv());

  constructor() {
    this.cargarCarrito();
  }

  agregarProducto(producto: {
    idProducto: number;
    nombre: string;
    precio: number;
    imagen?: string;
    stock: number;
  }): void {
    const itemsActuales = [...this.items()];
    const itemExistente = itemsActuales.find(item => item.idProducto === producto.idProducto);

    if (itemExistente) {
      if (itemExistente.cantidad < producto.stock) {
        itemExistente.cantidad++;
      } else {
        throw new Error('No hay más stock disponible');
      }
    } else {
      itemsActuales.push({
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen,
        stock: producto.stock
      });
    }

    this.items.set(itemsActuales);
    this.guardarCarrito();
  }

  actualizarCantidad(idProducto: number, cantidad: number): void {
    if (cantidad < 1) return;

    const itemsActuales = [...this.items()];
    const item = itemsActuales.find(i => i.idProducto === idProducto);

    if (item) {
      if (cantidad <= item.stock) {
        item.cantidad = cantidad;
        this.items.set(itemsActuales);
        this.guardarCarrito();
      } else {
        throw new Error('Cantidad mayor al stock disponible');
      }
    }
  }

  eliminarProducto(idProducto: number): void {
    const itemsActuales = this.items().filter(item => item.idProducto !== idProducto);
    this.items.set(itemsActuales);
    this.guardarCarrito();
  }

  vaciarCarrito(): void {
    this.items.set([]);
    this.guardarCarrito();
  }

  private cargarCarrito(): void {
    try {
      const carritoGuardado = localStorage.getItem(this.STORAGE_KEY);
      if (carritoGuardado) {
        const items = JSON.parse(carritoGuardado);
        this.items.set(items);
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      this.items.set([]);
    }
  }

  private guardarCarrito(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }
}