import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService, PedidoRes } from '../../core/services/pedido.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-pedidos.component.html'
})
export class MisPedidosComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);
  private readonly authService = inject(AuthService);

  pedidos = signal<PedidoRes[]>([]);
  loading = signal(true);
  filtroEstado = signal<string>('TODOS');

  pedidosFiltrados = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'TODOS') return this.pedidos();
    return this.pedidos().filter(p => p.estadoPedido === filtro);
  });

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    const idCliente = 1;

    this.pedidoService.listarPedidosPorCliente(idCliente, 0, 100).subscribe({
      next: (response) => {
        if (response.success && response.data.content) {
          this.pedidos.set(response.data.content);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getEstadoClass(estado: string): string {
    const classes: Record<string, string> = {
      'PENDIENTE': 'bg-amber-100 text-amber-700 border-amber-300',
      'PROCESANDO': 'bg-blue-100 text-blue-700 border-blue-300',
      'EN_CAMINO': 'bg-purple-100 text-purple-700 border-purple-300',
      'ENTREGADO': 'bg-emerald-100 text-emerald-700 border-emerald-300',
      'CANCELADO': 'bg-rose-100 text-rose-700 border-rose-300'
    };
    return classes[estado] || 'bg-stone-100 text-stone-700 border-stone-300';
  }

  getEstadoIcon(estado: string): string {
    const icons: Record<string, string> = {
      'PENDIENTE': '⏳',
      'PROCESANDO': '📦',
      'EN_CAMINO': '🚚',
      'ENTREGADO': '✅',
      'CANCELADO': '❌'
    };
    return icons[estado] || '📋';
  }

  cancelarPedido(id: number): void {
    if (confirm('¿Estás seguro de cancelar este pedido?')) {
      this.pedidoService.cancelarPedido(id).subscribe({
        next: () => {
          alert('Pedido cancelado exitosamente');
          this.cargarPedidos();
        },
        error: () => alert('Error al cancelar el pedido')
      });
    }
  }
}
