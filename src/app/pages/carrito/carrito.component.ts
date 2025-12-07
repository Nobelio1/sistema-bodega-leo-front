import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PedidoService } from '../../core/services/pedido.service';
import { CarritoService } from './carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './carrito.component.html'
})
export class CarritoComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly pedidoService = inject(PedidoService);
  private readonly carritoService = inject(CarritoService);
  private readonly router = inject(Router);

  productos = this.carritoService.itemsCarrito;
  loading = false;

  subtotal = this.carritoService.subtotal;
  igv = this.carritoService.igv;
  total = this.carritoService.total;

  ngOnInit(): void {
  }

  actualizarCantidad(idProducto: number, cantidad: number): void {
    if (cantidad < 1) return;
    
    try {
      this.carritoService.actualizarCantidad(idProducto, cantidad);
    } catch (error: any) {
      alert(error.message || 'Error al actualizar cantidad');
    }
  }

  eliminarProducto(idProducto: number): void {
    if (confirm('¿Estás seguro de eliminar este producto del carrito?')) {
      this.carritoService.eliminarProducto(idProducto);
    }
  }

  vaciarCarrito(): void {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.carritoService.vaciarCarrito();
    }
  }

  procesarPedido(): void {
    if (this.productos().length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const user = this.authService.currentUser();
    if (!user) {
      alert('Debes iniciar sesión para realizar un pedido');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loading = true;

    const pedidoData = {
      idCliente: 1,
      idEstado: 1,
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
        this.loading = false;
        if (response.success) {
          alert('¡Pedido creado exitosamente! Código de recojo: ' + response.data);
          this.carritoService.vaciarCarrito();
          this.router.navigate(['/mis-pedidos']);
        } else {
          alert('Error: ' + response.message);
        }
      },
      error: (error) => {
        this.loading = false;
        alert('Error al crear el pedido: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }
}