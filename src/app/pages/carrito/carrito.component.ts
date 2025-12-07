import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PedidoService } from '../../core/services/pedido.service';

interface ProductoCarrito {
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  stock: number;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './carrito.component.html'
})
export class CarritoComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly pedidoService = inject(PedidoService);

  productos = signal<ProductoCarrito[]>([]);
  loading = signal(false);

  subtotal = computed(() => {
    return this.productos().reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  });

  igv = computed(() => this.subtotal() * 0.18);
  total = computed(() => this.subtotal() + this.igv());

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.productos.set(JSON.parse(carritoGuardado));
    }
  }

  actualizarCantidad(index: number, cantidad: number): void {
    if (cantidad < 1) return;
    const prods = [...this.productos()];
    if (cantidad <= prods[index].stock) {
      prods[index].cantidad = cantidad;
      this.productos.set(prods);
      this.guardarCarrito();
    }
  }

  eliminarProducto(index: number): void {
    const prods = [...this.productos()];
    prods.splice(index, 1);
    this.productos.set(prods);
    this.guardarCarrito();
  }

  vaciarCarrito(): void {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.productos.set([]);
      this.guardarCarrito();
    }
  }

  procesarPedido(): void {
    if (this.productos().length === 0) return;

    this.loading.set(true);

    const pedidoData = {
      idCliente: 1, // Obtener del usuario actual
      idEstado: 1, // Estado inicial
      montoTotal: this.total(),
      detallePedido: this.productos().map(p => ({
        idProducto: p.idProducto,
        cantidad: p.cantidad,
        precio: p.precio,
        subtotal: p.precio * p.cantidad
      }))
    };

    this.pedidoService.crearPedido(pedidoData).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success) {
          alert('¡Pedido creado exitosamente! Código: ' + response.data);
          this.vaciarCarrito();
        }
      },
      error: () => {
        this.loading.set(false);
        alert('Error al crear el pedido');
      }
    });
  }

  private guardarCarrito(): void {
    localStorage.setItem('carrito', JSON.stringify(this.productos()));
  }
}
