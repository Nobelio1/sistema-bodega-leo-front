import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService, PedidoRes } from '../../../core/services/pedido.service';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-stone-900">Gestión de Pedidos</h2>
        <p class="text-sm text-stone-600">Visualiza y gestiona todos los pedidos</p>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-sm">
        <div class="flex gap-3 flex-wrap">
          @for (estado of ['TODOS', 'PENDIENTE', 'PROCESANDO', 'ENTREGADO', 'CANCELADO']; track estado) {
            <button (click)="filtroEstado.set(estado)"
                    [class]="filtroEstado() === estado ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-700'"
                    class="px-4 py-2 rounded-xl font-semibold hover:shadow-md transition">
              {{ estado }}
            </button>
          }
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        @if (loading()) {
          <div class="p-8">
            <div class="animate-pulse space-y-4">
              @for (i of [1,2,3,4,5]; track i) {
                <div class="h-16 bg-stone-100 rounded"></div>
              }
            </div>
          </div>
        } @else {
          <table class="w-full">
            <thead class="bg-stone-50">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Código</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Cliente</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Fecha</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Total</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Estado</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-stone-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (pedido of pedidosFiltrados(); track pedido.idPedido) {
                <tr class="border-t border-stone-100 hover:bg-stone-50">
                  <td class="px-6 py-4">
                    <span class="font-mono font-semibold text-stone-900">{{ pedido.codigoRecojo }}</span>
                  </td>
                  <td class="px-6 py-4">{{ pedido.nombreCliente }}</td>
                  <td class="px-6 py-4 text-sm text-stone-600">{{ pedido.fechaPedido }}</td>
                  <td class="px-6 py-4">
                    <span class="font-bold text-orange-600">S/ {{ pedido.montoTotal | number: '1.0-2' }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold"
                          [class]="getEstadoClass(pedido.estadoPedido)">
                      {{ pedido.estadoPedido }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <button class="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                      Ver detalle →
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `
})
export class PedidosAdminComponent implements OnInit {
  private readonly pedidoService = inject(PedidoService);

  pedidos = signal<PedidoRes[]>([]);
  loading = signal(true);
  filtroEstado = signal('TODOS');

  pedidosFiltrados = signal<PedidoRes[]>([]);

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.loading.set(true);
    this.pedidoService.listarPedidos(0, 100).subscribe({
      next: (response) => {
        if (response.success && response.data.content) {
          this.pedidos.set(response.data.content);
          this.aplicarFiltro();
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  aplicarFiltro(): void {
    const filtro = this.filtroEstado();
    if (filtro === 'TODOS') {
      this.pedidosFiltrados.set(this.pedidos());
    } else {
      this.pedidosFiltrados.set(this.pedidos().filter(p => p.estadoPedido === filtro));
    }
  }

  getEstadoClass(estado: string): string {
    const classes: Record<string, string> = {
      'PENDIENTE': 'bg-amber-100 text-amber-700',
      'PROCESANDO': 'bg-blue-100 text-blue-700',
      'ENTREGADO': 'bg-emerald-100 text-emerald-700',
      'CANCELADO': 'bg-rose-100 text-rose-700'
    };
    return classes[estado] || 'bg-stone-100 text-stone-700';
  }
}
